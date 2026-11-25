# Testbarkeit und Greyboxing

**Zweck:** Legt fest, wie der Prototyp ohne zusätzliche Testwerkzeuge geprüft wird und wie die Greybox-Darstellung aussieht.
**Zielgruppe:** Alle Code-Agenten, Test-Agenten.
**Abhängigkeiten:** [architecture.md](architecture.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt separate Testmöglichkeiten für Gameplay, Visuals und die kombinierte Darstellung (D-025).
- CONFIRMED: Greybox-Grafiken (einfache geometrische Platzhalter) statt finaler Grafiken (D-006, D-024).
- CONFIRMED: Keine zusätzlichen Testframeworks, keine Zufalls-Seed-Systeme, keine Simulationstools, keine Entwickler-Dashboards (D-060).
- CONFIRMED: Die Greybox bleibt als technischer Vergleichsmodus erhalten, auch wenn der erweiterte Gesamtprototyp (D-062) eine eigene Spieloptik erhält. Die Greybox-Anforderung „keine externen Bilddateien“ (REQ-TST-002) gilt für diesen Greybox-Modus.
- CONFIRMED: Jede Testversion zeigt im Spiel Testversion, Branch und Commit-ID und wird nur veröffentlicht, wenn Build und Selbsttest erfolgreich sind (D-063). Details: [deployment-and-previews.md](deployment-and-previews.md).
- CONFIRMED: Jede größere neue Funktion ist separat testbar (D-063).

## Technische Festlegungen (TECH-13, revidierbar)

- **Gameplay-Test:** Datei `src/tests/selftest.ts` mit einfachen Prüffunktionen (kleine eigene `check(name, bedingung)`-Hilfe, keine Bibliothek). Sie importiert nur `game/` und `config.ts` und läuft in Node ohne Browser: `node src/tests/selftest.ts` (Node 22 führt TypeScript durch Typentfernung direkt aus). Dazu müssen relative Importe in `game/` und `config.ts` die Endung `.ts` tragen und dürfen keine Enums, Namespaces oder Parameter-Properties verwenden. Dieselbe Datei läuft im Browser über `?mode=selftest` und zeigt die Ergebnisse als Text.
- **Visuals-Test:** `?mode=visuals` startet die VisualsScene. Sie zeigt einen vorgegebenen Zustand ohne laufende Simulation, mit Tasten zum Umschalten zwischen den Zuständen (Teile intakt, beschädigt, zerstört, Zonen sichtbar, Gegner an festen Positionen). Sie ruft kein `stepWorld` auf.
- **Kombinierter Test:** Das normale Spiel (`index.html` ohne Parameter).
- **Funktionstests des erweiterten Prototyps (TECH, ab Stufe 1):** Neue Funktionen erhalten nach Möglichkeit einen eigenen Modus per URL-Parameter nach demselben Muster (z. B. `?mode=rebuild`), damit sie ohne den gesamten Spielablauf ausprobiert werden können. Die konkreten Modi legen die jeweiligen Funktionsaufträge fest.
- **Testversionen (TECH-23, TECH-24):** Feature-Branches werden automatisch als Testversion veröffentlicht, die Kennzeichnung im Spiel kommt aus `src/view/buildInfo.ts`. Die CI führt `npm ci`, `npm run build` und `node src/tests/selftest.ts` aus.
- **Zufall:** Tests übergeben eine feste Zufallsfunktion, es gibt kein Seed-System.

## Offen

Keine Gameplay-Fragen.

## Anforderungen

### REQ-TST-001 – Drei getrennte Testmöglichkeiten
- **Problemstellung:** Fehler sollen nach Gameplay, Visuals oder Zusammenspiel eingrenzbar sein.
- **Ziel:** Gameplay, Visuals und kombinierte Darstellung sind jeweils getrennt prüfbar.
- **Gewünschtes Verhalten:** (a) Gameplay: Selbsttest ohne Darstellung. (b) Visuals: statische Darstellung ohne Simulation. (c) Kombiniert: das normale Spiel.
- **Akzeptanzkriterien:** (1) Alle drei sind einzeln startbar. (2) Der Gameplay-Test braucht weder Browser noch Phaser. (3) Der Visuals-Test ruft `stepWorld` nicht auf. (4) Der Start jeder Variante ist im Projekt beschrieben (kurze Anleitung in der Projektdokumentation).
- **Testfälle:** manuell/auto: Jede der drei Varianten starten und das Ergebnis dokumentieren.
- **Abhängigkeiten:** REQ-ARC-001, REQ-ARC-002.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-025); TECH (Form, TECH-13).

### REQ-TST-002 – Greybox-Darstellung
- **Problemstellung:** Der Prototyp soll ohne Assets lauffähig sein.
- **Ziel:** Alle Entitäten sind einfache geometrische Formen.
- **Gewünschtes Verhalten:** Lokomotive, Wagon, Geschütz, Spieler, Gegner, Reparaturzonen und Trefferlinien erscheinen als einfache Formen, unterscheidbar durch Form, Farbe und Größe. Zerstörte Teile sind sichtbar anders dargestellt.
- **Akzeptanzkriterien:** (1) Keine externen Bilddateien. (2) Die Entitätsarten sind unterscheidbar. (3) Zerstört, beschädigt und intakt sind unterscheidbar. (4) Reparaturzonen sind klar erkennbar.
- **Testfälle:** manuell: Visuals-Test durchsehen. Die visuelle Qualität ist eine menschliche Bewertung und für Greybox kein Kriterium.
- **Abhängigkeiten:** REQ-ARC-003, REQ-REP-002.
- **Entscheidungsstatus:** CONFIRMED (D-006).

### REQ-TST-004 – Testversionen sind erkennbar
- **Problemstellung:** Der Projektverantwortliche muss wissen, welchen Stand er gerade spielt.
- **Ziel:** Jede Testversion zeigt Testversion, Branch und Commit-ID.
- **Gewünschtes Verhalten:** Ein Hinweisfeld im Spiel nennt „TESTVERSION“, den Branch und die Commit-ID. Der akzeptierte Stand (`main`) und lokale Starts zeigen es nicht.
- **Akzeptanzkriterien:** (1) Bei einem Build mit `VITE_BUILD_KIND=preview` erscheint das Feld mit den übergebenen Werten für Branch und Commit. (2) Ohne diese Variable erscheint kein Feld. (3) Das Feld beeinflusst weder Spiellogik noch Spielfeldskalierung noch Eingaben. (4) Das Feld ist in jedem Modus (Spiel, Visuals, Selbsttest) sichtbar.
- **Testfälle:** manuell: Testversion öffnen und das Feld prüfen, `main` öffnen und das Fehlen prüfen. menschl. Bewertung: Lesbarkeit.
- **Abhängigkeiten:** deployment-and-previews.
- **Entscheidungsstatus:** CONFIRMED (D-063); TECH (Umsetzung, TECH-23).

### REQ-TST-005 – Prüfung vor der Veröffentlichung
- **Problemstellung:** Eine fehlerhafte Testversion darf nicht veröffentlicht werden und den akzeptierten Stand nicht beeinflussen.
- **Ziel:** Veröffentlichung nur nach erfolgreichem Build und Selbsttest, mit Schutz des akzeptierten Standes.
- **Gewünschtes Verhalten:** Vor jeder Veröffentlichung laufen `npm ci`, `npm run build` und `node src/tests/selftest.ts`. Schlägt ein Schritt fehl, wird nichts veröffentlicht. Eine Testversion schreibt nur in ihren eigenen Ordner unter `preview/`.
- **Akzeptanzkriterien:** (1) Die Veröffentlichung hängt von Build und Selbsttest ab. (2) Das Veröffentlichungsskript bricht ab, wenn eine Testversion Pfade außerhalb von `preview/` ändern würde oder der akzeptierte Stand Pfade unter `preview/`. (3) Der akzeptierte Stand bleibt bei jeder Testversionsveröffentlichung erhalten und umgekehrt.
- **Testfälle:** auto/manuell: Skript gegen ein lokales Test-Repository (Veröffentlichen von `main`, mehrerer Testversionen, Aktualisieren, Entfernen, Aufräumen, Ablehnen ungültiger Branches). manuell: Dummy-Veröffentlichung nach Freigabe (siehe deployment-and-previews.md).
- **Abhängigkeiten:** deployment-and-previews.
- **Entscheidungsstatus:** CONFIRMED (D-063); TECH (Umsetzung, TECH-24).

### REQ-TST-003 – Selbsttest für die Gameplay-Anforderungen
- **Problemstellung:** Akzeptanzkriterien müssen wiederholbar prüfbar sein, ohne zusätzliche Werkzeuge.
- **Ziel:** Jedes objektiv prüfbare Akzeptanzkriterium hat eine Prüfung im Selbsttest, sonst eine dokumentierte manuelle Prüfung.
- **Gewünschtes Verhalten:** Der Selbsttest führt benannte Prüfungen aus und meldet je Prüfung bestanden oder nicht bestanden sowie ein Gesamtergebnis. Er beendet den Node-Prozess mit Fehlercode, wenn eine Prüfung scheitert.
- **Akzeptanzkriterien:** (1) Jede Prüfung nennt die REQ-ID, die sie abdeckt. (2) Prüfungen sind unabhängig voneinander (je eigene Welt). (3) Zufall nur über die injizierte Funktion. (4) Gesamtergebnis ist sichtbar. (5) Keine zusätzlichen Pakete.
- **Testfälle:** auto: Zwei Läufe nacheinander liefern dasselbe Ergebnis. Eine absichtlich falsche Prüfung (nur lokal zum Test) schlägt fehl und liefert Fehlercode.
- **Abhängigkeiten:** architecture (REQ-ARC-007).
- **Entscheidungsstatus:** CONFIRMED (Testpflicht, D-029; keine zusätzlichen Frameworks und Seeds, D-060); TECH (Form). Die frühere Idee eines seedbasierten Determinismus entfällt (D-060).
