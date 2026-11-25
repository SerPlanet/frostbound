# Testbarkeit und Greyboxing

**Zweck:** Legt fest, wie der Prototyp ohne zusätzliche Testwerkzeuge geprüft wird und wie die Greybox-Darstellung aussieht.
**Zielgruppe:** Alle Code-Agenten, Test-Agenten.
**Abhängigkeiten:** [architecture.md](architecture.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt separate Testmöglichkeiten für Gameplay, Visuals und die kombinierte Darstellung (D-025).
- CONFIRMED: Greybox-Grafiken (einfache geometrische Platzhalter) statt finaler Grafiken (D-006, D-024).
- CONFIRMED: Keine zusätzlichen Testframeworks, keine Zufalls-Seed-Systeme, keine Simulationstools, keine Entwickler-Dashboards (D-060).

## Technische Festlegungen (TECH-13, revidierbar)

- **Gameplay-Test:** Datei `src/tests/selftest.ts` mit einfachen Prüffunktionen (kleine eigene `check(name, bedingung)`-Hilfe, keine Bibliothek). Sie importiert nur `game/` und `config.ts` und läuft in Node ohne Browser: `node src/tests/selftest.ts` (Node 22 führt TypeScript durch Typentfernung direkt aus). Dazu müssen relative Importe in `game/` und `config.ts` die Endung `.ts` tragen und dürfen keine Enums, Namespaces oder Parameter-Properties verwenden. Dieselbe Datei läuft im Browser über `?mode=selftest` und zeigt die Ergebnisse als Text.
- **Visuals-Test:** `?mode=visuals` startet die VisualsScene. Sie zeigt einen vorgegebenen Zustand ohne laufende Simulation, mit Tasten zum Umschalten zwischen den Zuständen (Teile intakt, beschädigt, zerstört, Zonen sichtbar, Gegner an festen Positionen). Sie ruft kein `stepWorld` auf.
- **Kombinierter Test:** Das normale Spiel (`index.html` ohne Parameter).
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

### REQ-TST-003 – Selbsttest für die Gameplay-Anforderungen
- **Problemstellung:** Akzeptanzkriterien müssen wiederholbar prüfbar sein, ohne zusätzliche Werkzeuge.
- **Ziel:** Jedes objektiv prüfbare Akzeptanzkriterium hat eine Prüfung im Selbsttest, sonst eine dokumentierte manuelle Prüfung.
- **Gewünschtes Verhalten:** Der Selbsttest führt benannte Prüfungen aus und meldet je Prüfung bestanden oder nicht bestanden sowie ein Gesamtergebnis. Er beendet den Node-Prozess mit Fehlercode, wenn eine Prüfung scheitert.
- **Akzeptanzkriterien:** (1) Jede Prüfung nennt die REQ-ID, die sie abdeckt. (2) Prüfungen sind unabhängig voneinander (je eigene Welt). (3) Zufall nur über die injizierte Funktion. (4) Gesamtergebnis ist sichtbar. (5) Keine zusätzlichen Pakete.
- **Testfälle:** auto: Zwei Läufe nacheinander liefern dasselbe Ergebnis. Eine absichtlich falsche Prüfung (nur lokal zum Test) schlägt fehl und liefert Fehlercode.
- **Abhängigkeiten:** architecture (REQ-ARC-007).
- **Entscheidungsstatus:** CONFIRMED (Testpflicht, D-029; keine zusätzlichen Frameworks und Seeds, D-060); TECH (Form). Die frühere Idee eines seedbasierten Determinismus entfällt (D-060).
