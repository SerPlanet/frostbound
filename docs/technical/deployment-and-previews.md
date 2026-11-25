# Testversionen und Veröffentlichung

**Zweck:** Beschreibt, wie der akzeptierte Spielstand (`main`) und die Testversionen der Feature-Branches veröffentlicht werden, wie das Ganze geschützt ist und wie die Umstellung abläuft.
**Zielgruppe:** Alle Agenten und der Projektverantwortliche.
**Abhängigkeiten:** [../project/process.md](../project/process.md) (Branch-Regeln, Freigabe), [architecture.md](architecture.md) (TECH-17, TECH-23), [testing-and-greybox.md](testing-and-greybox.md).

## Bestätigte Regeln

- CONFIRMED: `main` ist der stabile, vom Projektverantwortlichen akzeptierte Spielstand. Neue Funktionen entstehen auf `feature/<name>`. Jede Funktion bekommt eine eigene Testversion. Es gibt keine Integration ohne ausdrückliche Freigabe (D-063).
- CONFIRMED: Der akzeptierte Stand liegt unter `https://serplanet.github.io/frostbound/`. Testversionen liegen unter `https://serplanet.github.io/frostbound/preview/<name>/` (D-063).
- CONFIRMED: Jede Testversion zeigt im Spiel Testversion, Branch und Commit-ID (D-063).
- CONFIRMED: Eine Testversion wird nur veröffentlicht, wenn Build und Selbsttest erfolgreich sind (D-063).

Alles Weitere in diesem Dokument ist **TECH** (technische Umsetzung, revidierbar, D-060) und ändert keine Spielregel.

## Überblick (TECH-24)

| Was | Wo | Wer schreibt dorthin |
|---|---|---|
| Quellcode, `main` | Branch `main` | nur nach Freigabe des Projektverantwortlichen |
| Quellcode, Entwicklung | Branches `feature/<name>`, `chore/<name>` | Agenten |
| Akzeptierter Stand (live) | Wurzel des Branches `gh-pages` | nur der Workflow bei einem Push auf `main` |
| Testversionen | `preview/<name>/` im Branch `gh-pages` | nur der Workflow bei einem Push auf `feature/<name>` |

`gh-pages` enthält ausschließlich veröffentlichte Build-Dateien, keinen Quellcode, und immer genau einen Commit (keine Historie). So wächst das Repository nicht mit jedem Build.

## Workflows

| Datei | Zweck |
|---|---|
| `.github/workflows/ci.yml` | Prüft Branches ohne Testversion (z. B. `chore/...`) und Pull Requests: `npm ci`, `npm run build`, `node src/tests/selftest.ts`. Veröffentlicht nichts. |
| `.github/workflows/publish.yml` | Für `main` und `feature/**`: Prüfung (Build mit passendem Pfad, Selbsttest), danach Veröffentlichung in `gh-pages`. Räumt beim Löschen eines Feature-Branches die Testversion auf. Manuell: `main` neu veröffentlichen oder verwaiste Testversionen entfernen. |
| `.github/workflows/pages.yml` | Bisheriges Deployment des akzeptierten Standes über „GitHub Actions“. Läuft unverändert weiter, solange die Repository-Variable `PAGES_MODE` nicht `branch` ist. Führt zusätzlich den Selbsttest aus. |
| `scripts/publish-pages.sh` | Kernlogik der Veröffentlichung (Ordnernamen, Schreiben nach `gh-pages`, Schutzregeln, Aufräumen). |

**Ausschalter:** Das Veröffentlichen in `gh-pages` ist abgeschaltet, solange `PAGES_MODE` nicht auf `branch` steht. Bis dahin prüft `publish.yml` nur (Build und Selbsttest), und `pages.yml` veröffentlicht wie bisher. Mit `PAGES_MODE=branch` tauschen sich beide: `pages.yml` pausiert, `publish.yml` veröffentlicht.

## Ordnernamen der Testversionen

Der Ordnername wird aus dem Branch-Namen abgeleitet, damit er in URLs und Dateipfaden sicher ist:

1. Das Präfix `feature/` entfällt.
2. Großbuchstaben werden klein, alle Zeichen außer `a-z` und `0-9` werden zu `-`, mehrfache und äußere `-` entfallen.
3. Wurde der Name dabei verändert oder auf 40 Zeichen gekürzt, hängt ein Hash des Originalnamens (6 Zeichen) an. Dadurch kollidieren `feature/a/b` und `feature/a-b` nicht.
4. Ergibt sich kein gültiger Name, bricht das Skript ab.

| Branch | Ordner und URL |
|---|---|
| `feature/rebuild` | `/frostbound/preview/rebuild/` |
| `feature/a-b` | `/frostbound/preview/a-b/` |
| `feature/a/b` | `/frostbound/preview/a-b-fb0f55/` |
| `feature/Tag_Wechsel` | `/frostbound/preview/tag-wechsel-<hash>/` |

Testversionen gibt es nur für Branches `feature/<name>`. Eine Übersicht aller aktuellen Testversionen steht unter `/frostbound/preview/` (automatisch erzeugte Liste mit Branch und Commit).

## Schutz des akzeptierten Standes

- Der Build einer Testversion verwendet den Pfad `/frostbound/preview/<name>/`. Seine Dateien können nicht auf die Wurzel zeigen (geprüft: alle Verweise im Build liegen unter dem Pfad, der Zugriff auf die Wurzel liefert nichts).
- Das Skript prüft vor jedem Commit, welche Dateien sich ändern. Eine Testversion darf nur Pfade unter `preview/` ändern, der akzeptierte Stand nie etwas unter `preview/`. Bei einer Verletzung bricht das Skript ab, es wird nichts veröffentlicht.
- Ein Push auf `main` ersetzt nur die Wurzel und lässt `preview/` unverändert. Ein Push auf einen Feature-Branch ersetzt nur den eigenen Ordner.
- Ein Build-Ordner mit einem Ordner `preview` wird abgelehnt.

## Parallele Veröffentlichungen

- Pro Branch läuft nur die jeweils neueste Veröffentlichung (ältere werden abgebrochen).
- Verschiedene Branches dürfen gleichzeitig veröffentlichen. Das Skript schreibt mit `--force-with-lease` und wiederholt bis zu fünfmal, wenn ein anderer Lauf zuerst fertig war. Lokal getestet mit drei gleichzeitigen Veröffentlichungen: alle drei sind danach vorhanden, der akzeptierte Stand ist unverändert.

## Aufräumen

- Wird ein Branch `feature/<name>` gelöscht (z. B. nach der Integration), entfernt der Workflow den zugehörigen Ordner. Hinweis: GitHub führt Workflows für das Ereignis „delete“ nur aus, wenn sie auf dem Standardbranch (`main`) liegen. Das gilt also erst nach der Integration der Stufe 0.
- Manuell: Workflow „Build, test and publish“ mit der Aktion `prune` entfernt alle Ordner, deren Branch nicht mehr existiert.

## Kennzeichnung im Spiel (TECH-23)

Der Build erhält `VITE_BUILD_KIND`, `VITE_BUILD_BRANCH` und `VITE_BUILD_COMMIT`. Nur bei `VITE_BUILD_KIND=preview` zeigt `src/view/buildInfo.ts` oben links ein orangefarbenes Feld „TESTVERSION · Branch: … · Commit: …“. Es ist ein reines Overlay ohne Einfluss auf Spiel und Szenen. Der akzeptierte Stand und lokale Starts zeigen nichts an.

## Lokal prüfen

```
# Testversion lokal bauen (unter Windows Git Bash zusätzlich: export MSYS_NO_PATHCONV=1)
VITE_BUILD_KIND=preview VITE_BUILD_BRANCH=feature/beispiel VITE_BUILD_COMMIT=abc1234 \
  npm run build -- --base=/frostbound/preview/beispiel/
bash scripts/publish-pages.sh slug feature/beispiel     # gibt den Ordnernamen aus
```

Das Veröffentlichungsskript lässt sich gegen ein leeres lokales Repository testen (`PAGES_REMOTE=file:///pfad/zum/test.git`).

## Umstellung auf gh-pages (noch nicht durchgeführt, braucht ausdrückliche Freigabe)

Die Pages-Quelle ist aktuell „GitHub Actions“. Der gh-pages-Ansatz verlangt „Deploy from a branch“. Das ist eine Änderung an der Live-Veröffentlichung. Sie darf nur mit ausdrücklicher Zustimmung des Projektverantwortlichen erfolgen. Vorgesehener Ablauf:

1. Stufe 0 nach Freigabe in `main` integrieren (damit `delete`-Aufräumen und manuelle Aktionen auf `main` existieren). Dabei ändert sich nichts an der Live-Seite: `PAGES_MODE` ist noch nicht gesetzt.
2. Repository-Variable setzen: `gh variable set PAGES_MODE --body branch`. Ab jetzt pausiert `pages.yml`. Die Live-Seite bleibt auf dem letzten Stand, bis die Quelle umgestellt ist.
3. `main` in `gh-pages` veröffentlichen: Workflow „Build, test and publish“, Aktion `publish-main`. Prüfen, dass `gh-pages` die erwarteten Dateien enthält.
4. Dummy-Test: einen Branch `feature/stage0-dummy` pushen und prüfen, dass die Testversion in `gh-pages` unter `preview/stage0-dummy/` erscheint und die Wurzel unverändert bleibt.
5. Pages-Quelle umstellen (Einstellungen → Pages → Branch `gh-pages`, Ordner `/`, oder `gh api -X PUT repos/SerPlanet/frostbound/pages -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/"`). Dann die URLs des akzeptierten Standes und der Dummy-Testversion im Browser prüfen.
6. Rückweg bei Problemen: Quelle wieder auf `build_type=workflow` setzen, `gh variable delete PAGES_MODE`, `pages.yml` manuell starten.

## Risiken und offene technische Fragen

- **Nicht auf GitHub erprobt:** Das Veröffentlichungsskript, der Build mit Unterpfad und die Workflow-Syntax sind lokal geprüft. Noch nicht beobachtet: ob GitHub nach einem Push in `gh-pages` mit dem Workflow-Token zuverlässig die Seite neu baut, die Wartezeit bis zur Sichtbarkeit und das Verhalten des `delete`-Ereignisses. Das zeigt erst der Dummy-Test (Schritt 4 und 5).
- **Öffentlichkeit:** Das Repository ist öffentlich, also auch alle Testversionen.
- **Pages-Störungen:** Bei einer Störung von GitHub Pages sind auch Testversionen betroffen. Ausweichen: Build-Artefakt aus dem Workflow-Lauf herunterladen und lokal mit `npm run preview` starten.
- **Pages-Grenzen:** GitHub Pages hat Größen- und Bau-Grenzen. Bei vielen gleichzeitigen Testversionen mit Grafiken könnte die Seite groß werden. Abhilfe: Branches nach der Abnahme löschen, `prune` nutzen.
- **Browser-Speicher:** Alle Testversionen und der akzeptierte Stand teilen sich dieselbe Domain. Ein späterer Spielstand im Browser-Speicher (`localStorage`) muss deshalb einen Schlüssel mit Version oder Branch verwenden, sonst überschreiben sich Stände.
- **Zwischenspeicher des Browsers:** Nach einer Veröffentlichung kann der Browser kurz den alten Stand zeigen. Die Commit-ID im Hinweisfeld zeigt, welcher Stand läuft.
