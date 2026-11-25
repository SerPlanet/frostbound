#!/usr/bin/env bash
# Veröffentlicht Build-Dateien in den Branch gh-pages (Stufe 0 des erweiterten Prototyps, D-062/D-063).
# Beschreibung und Umstellungsablauf: docs/technical/deployment-and-previews.md
#
# Aufruf:
#   publish-pages.sh slug <branch>                    gibt den Preview-Ordnernamen zu einem Branch aus
#   publish-pages.sh main <dist-ordner> <commit>      akzeptierter Stand: ersetzt die Wurzel, behält preview/
#   publish-pages.sh preview <dist-ordner> <branch> <commit>
#                                                     Testversion: ersetzt nur preview/<slug>/
#   publish-pages.sh remove <branch>                  entfernt preview/<slug>/
#   publish-pages.sh prune                            entfernt Preview-Ordner, deren Branch nicht mehr existiert
#
# Umgebung:
#   PAGES_REMOTE   Git-URL des Repositorys (mit Zugang). Pflicht, außer bei "slug".
#   PAGES_BRANCH   Veröffentlichungsbranch, Standard: gh-pages
#
# Schutzregeln (werden vor dem Commit geprüft, bei Verletzung bricht das Skript ab):
#   - "preview", "remove", "prune" ändern ausschließlich Pfade unter preview/ (nie den Hauptstand).
#   - "main" ändert nie Pfade unter preview/ (Testversionen bleiben erhalten).
#   - Testversionen gibt es nur für Branches feature/<name>.
# gh-pages enthält immer genau einen Commit (keine Historie), damit das Repository nicht mit Build-Dateien wächst.

set -euo pipefail

PAGES_BRANCH="${PAGES_BRANCH:-gh-pages}"
MAX_TRIES=5

die() {
  echo "FEHLER: $*" >&2
  exit 1
}

# Branch-Name -> sicherer Ordnername. Ohne Präfix "feature/", nur a-z, 0-9 und "-".
# Wurde der Name verändert oder gekürzt, hängt ein Hash des Originalnamens an (verhindert Kollisionen).
slug() {
  local branch="$1"
  local name="${branch#feature/}"
  local clean
  clean="$(printf '%s' "$name" | tr 'A-Z' 'a-z' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
  [ -n "$clean" ] || die "Branch-Name ergibt keinen gültigen Ordnernamen: '$branch'"
  if [ "$clean" != "$name" ] || [ "${#clean}" -gt 40 ]; then
    local hash
    hash="$(printf '%s' "$branch" | sha1sum | cut -c1-6)"
    clean="${clean:0:40}"
    clean="${clean%-}-$hash"
  fi
  printf '%s\n' "$clean"
}

require_feature_branch() {
  case "$1" in
    feature/?*) ;;
    *) die "Testversionen sind nur für Branches 'feature/<name>' erlaubt, nicht für '$1'" ;;
  esac
}

# Prüft, dass alle vorgemerkten Änderungen im erlaubten Bereich liegen.
#   $1 = "preview-only": alle Pfade müssen mit preview/ beginnen
#   $1 = "no-preview":   kein Pfad darf mit preview/ beginnen
check_scope() {
  local work="$1" rule="$2" path
  while IFS= read -r path; do
    [ -n "$path" ] || continue
    case "$rule" in
      preview-only) case "$path" in preview/*) ;; *) die "Schutzregel verletzt: Änderung außerhalb von preview/: $path" ;; esac ;;
      no-preview) case "$path" in preview/*) die "Schutzregel verletzt: Änderung unter preview/: $path" ;; esac ;;
    esac
  done < <(git -C "$work" diff --cached --name-only)
}

# Erzeugt preview/index.html (Liste aller Testversionen) oder entfernt sie, wenn es keine gibt.
write_preview_index() {
  local work="$1" dir slug branch commit rows="" any=0
  if [ -d "$work/preview" ]; then
    for dir in "$work"/preview/*/; do
      [ -d "$dir" ] || continue
      slug="$(basename "$dir")"
      branch="$(sed -n '1p' "$dir/.preview-info" 2>/dev/null || true)"
      commit="$(sed -n '2p' "$dir/.preview-info" 2>/dev/null || true)"
      rows="$rows<li><a href=\"$slug/\">$slug</a> &ndash; Branch ${branch:-?}, Commit ${commit:-?}</li>"$'\n'
      any=1
    done
  fi
  if [ "$any" = 1 ]; then
    printf '%s\n' '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>FROSTBOUND Testversionen</title></head><body><h1>FROSTBOUND Testversionen</h1><ul>' "$rows" '</ul></body></html>' >"$work/preview/index.html"
  else
    rm -f "$work/preview/index.html"
  fi
}

# Klont gh-pages (flach) oder legt ein leeres Arbeitsverzeichnis an. Setzt EXPECTED_SHA.
prepare_work() {
  local work="$1"
  rm -rf "$work"
  if git ls-remote --exit-code --heads "$PAGES_REMOTE" "$PAGES_BRANCH" >/dev/null 2>&1; then
    git clone --quiet --depth 1 --branch "$PAGES_BRANCH" "$PAGES_REMOTE" "$work"
    EXPECTED_SHA="$(git -C "$work" rev-parse HEAD)"
  else
    git init --quiet "$work"
    EXPECTED_SHA=""
  fi
  git -C "$work" config user.name "github-actions[bot]"
  git -C "$work" config user.email "41898282+github-actions[bot]@users.noreply.github.com"
}

# Führt eine Änderung aus, prüft die Schutzregel und veröffentlicht einen einzelnen Commit.
# $1 = Beschreibung, $2 = Schutzregel, $3... = Funktion und Argumente, die das Arbeitsverzeichnis ($WORK) ändert
publish() {
  local message="$1" rule="$2"
  shift 2
  local work try
  work="$(mktemp -d)/site"
  for try in $(seq 1 "$MAX_TRIES"); do
    prepare_work "$work"
    WORK="$work" "$@"
    : >"$work/.nojekyll"
    git -C "$work" add -A
    check_scope "$work" "$rule"
    if [ -n "$EXPECTED_SHA" ] && git -C "$work" diff --cached --quiet; then
      echo "Keine Änderung, nichts zu veröffentlichen."
      return 0
    fi
    git -C "$work" checkout --quiet --orphan snapshot
    git -C "$work" commit --quiet -m "$message"
    if [ -n "$EXPECTED_SHA" ]; then
      if git -C "$work" push --quiet --force-with-lease="$PAGES_BRANCH:$EXPECTED_SHA" "$PAGES_REMOTE" "snapshot:$PAGES_BRANCH"; then
        echo "Veröffentlicht: $message"
        return 0
      fi
    else
      if git -C "$work" push --quiet "$PAGES_REMOTE" "snapshot:$PAGES_BRANCH"; then
        echo "Veröffentlicht (neuer Branch $PAGES_BRANCH): $message"
        return 0
      fi
    fi
    echo "Push abgelehnt (parallele Veröffentlichung), Versuch $try von $MAX_TRIES wird wiederholt." >&2
    sleep $((try * 2))
  done
  die "Veröffentlichung nach $MAX_TRIES Versuchen nicht möglich"
}

apply_main() {
  # Wurzel ersetzen, preview/ und .git behalten
  find "$WORK" -mindepth 1 -maxdepth 1 ! -name .git ! -name preview -exec rm -rf {} +
  cp -a "$DIST"/. "$WORK"/
}

apply_preview() {
  rm -rf "$WORK/preview/$SLUG"
  mkdir -p "$WORK/preview/$SLUG"
  cp -a "$DIST"/. "$WORK/preview/$SLUG"/
  printf '%s\n%s\n' "$BRANCH" "$COMMIT" >"$WORK/preview/$SLUG/.preview-info"
  write_preview_index "$WORK"
}

apply_remove() {
  rm -rf "$WORK/preview/$SLUG"
  write_preview_index "$WORK"
}

apply_prune() {
  local dir branch
  if [ -d "$WORK/preview" ]; then
    for dir in "$WORK"/preview/*/; do
      [ -d "$dir" ] || continue
      branch="$(sed -n '1p' "$dir/.preview-info" 2>/dev/null || true)"
      if [ -z "$branch" ] || ! git ls-remote --exit-code --heads "$PAGES_REMOTE" "$branch" >/dev/null 2>&1; then
        echo "Entferne verwaisten Preview-Ordner: $(basename "$dir") (Branch '${branch:-unbekannt}')"
        rm -rf "$dir"
      fi
    done
  fi
  write_preview_index "$WORK"
}

check_dist() {
  [ -f "$1/index.html" ] || die "Build-Ordner '$1' enthält keine index.html"
  [ ! -e "$1/preview" ] || die "Build-Ordner '$1' darf keinen Ordner 'preview' enthalten"
}

command="${1:-}"
case "$command" in
  slug)
    [ $# -eq 2 ] || die "Aufruf: slug <branch>"
    slug "$2"
    ;;
  main)
    [ $# -eq 3 ] || die "Aufruf: main <dist> <commit>"
    : "${PAGES_REMOTE:?PAGES_REMOTE fehlt}"
    check_dist "$2"
    export DIST="$2"
    publish "Akzeptierter Stand main @ $3" no-preview apply_main
    ;;
  preview)
    [ $# -eq 4 ] || die "Aufruf: preview <dist> <branch> <commit>"
    : "${PAGES_REMOTE:?PAGES_REMOTE fehlt}"
    require_feature_branch "$3"
    check_dist "$2"
    export DIST="$2" BRANCH="$3" COMMIT="$4"
    SLUG="$(slug "$3")"
    export SLUG
    publish "Testversion $3 @ $4" preview-only apply_preview
    ;;
  remove)
    [ $# -eq 2 ] || die "Aufruf: remove <branch>"
    : "${PAGES_REMOTE:?PAGES_REMOTE fehlt}"
    require_feature_branch "$2"
    SLUG="$(slug "$2")"
    export SLUG
    publish "Testversion $2 entfernt" preview-only apply_remove
    ;;
  prune)
    : "${PAGES_REMOTE:?PAGES_REMOTE fehlt}"
    publish "Verwaiste Testversionen entfernt" preview-only apply_prune
    ;;
  *)
    die "Unbekanntes Kommando '$command'. Siehe Kopfkommentar."
    ;;
esac
