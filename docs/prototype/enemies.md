# Gegner

**Zweck:** Beschreibt Gegnertyp, Spawn, Bewegung, Zielwahl, Zielwechsel, Schaden und Despawn der Gegner.
**Zielgruppe:** Gameplay-Agent Gegner.
**Abhängigkeiten:** [core-gameplay.md](core-gameplay.md); Schaden am Zug: [train-and-defense.md](train-and-defense.md); Gegneranzahl: [difficulty.md](difficulty.md); Besiegen: [combat.md](combat.md).

## Bestätigte Regeln

- CONFIRMED: Im Prototyp existiert genau ein Gegnertyp (D-038). Spätere Typen dürfen unterschiedliche Geschwindigkeiten besitzen.
- CONFIRMED: Gegner kommen kontinuierlich von oben ins Spielfeld, gegebenenfalls zunächst außerhalb des sichtbaren Bereichs, und erscheinen nicht mitten im sichtbaren Spielfeld (D-013, D-034).
- CONFIRMED: Gegner wählen zufällig zwischen den verfügbaren intakten Zugteilen als Ziel, unabhängig von der Spawnposition, und bewegen sich darauf zu (D-051, D-039).
- CONFIRMED: Wird das gewählte Zugteil auf dem Weg zerstört, wählen sie sofort ein neues verfügbares intaktes Ziel. Sind keine intakten Zugteile mehr vorhanden, ist das Spiel verloren, und es wird kein Ziel mehr gesucht (D-051).
- CONFIRMED: Ein zerstörtes Zugteil ist auch während seiner Reparatur kein gültiges Ziel (D-039).
- CONFIRMED: Bewegung auf möglichst kurzem Weg, bewusst einfach und zombieartig, ohne Ausweichverhalten. Die Geschwindigkeit ist zu Beginn eher niedrig, Werte werden getestet (D-040, D-038).
- CONFIRMED: Erreicht ein Gegner sein Zugteil, verursacht er sofort einmalig 10 Schaden, unabhängig vom Zugteil, verschwindet danach und zählt als abgearbeitet (D-052).
- CONFIRMED: Der Spieler muss nicht jeden Gegner besiegen (D-016). Gegner beeinflussen den Spieler nicht (D-035).
- CONFIRMED: Die Gesamtzahl der Gegner ist je Schwierigkeitsgrad festgelegt (D-031). Die Schwierigkeit entsteht hauptsächlich durch Anzahl und Masse (D-038).
- CONFIRMED: Nach Spielende haben Gegner keinen Einfluss auf das Ergebnis (D-050).

## Offen

Endgültige Gegnerlebenspunkte und -tempo (Q-004, TESTWERT), Gegneranzahl, Spawnwerte (Q-001 bis Q-003, Q-018, TESTWERTE). Technische Festlegungen zur Zielwahl (gleiche Wahrscheinlichkeit, „erreicht“) stehen als TECH-07 in [../technical/architecture.md](../technical/architecture.md).

## Anforderungen

### REQ-ENM-001 – Spawn oberhalb, nicht im sichtbaren Feld
- **Problemstellung:** Gegner dürfen nicht „aus dem Nichts“ im sichtbaren Spielfeld erscheinen.
- **Ziel:** Spawn oberhalb des Spielfeldes und Eintritt durch Bewegung.
- **Gewünschtes Verhalten:** Spawnpositionen liegen oberhalb, auf der dem Zug gegenüberliegenden Seite, und dürfen außerhalb des sichtbaren Bereichs liegen. Von dort laufen die Gegner ins Spielfeld.
- **Akzeptanzkriterien:** (1) Jede Spawnposition liegt oberhalb des Spielfeldes. (2) Keine Spawnposition liegt im sichtbaren Spielfeld. (3) Ein gespawnter Gegner bewegt sich ab dem ersten Schritt auf sein Ziel zu. (4) Spawnpositionen kommen aus der Konfiguration.
- **Testfälle:** auto: Viele Spawns → alle oberhalb des Spielfeld-Rechtecks. manuell: Gegner treten von oben ein.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-001, REQ-CORE-004).
- **Entscheidungsstatus:** CONFIRMED (D-013, D-034).

### REQ-ENM-002 – Zufällige Zielwahl unter intakten Zugteilen
- **Problemstellung:** Das Ziel soll unabhängig vom Spawnort feststehen.
- **Ziel:** Jeder Gegner hat ein zufällig gewähltes, intaktes Zugteil als Ziel.
- **Gewünschtes Verhalten:** Bei der Zielwahl wird zufällig unter den verfügbaren intakten Zugteilen (nicht zerstörte Lokomotive oder Wagon) gewählt. Die Spawnposition geht nicht ein. Die Wahl erfolgt bereits vor oder während der Bewegung.
- **Akzeptanzkriterien:** (1) Das Ziel ist stets ein nicht zerstörtes Zugteil, nie das Geschütz. (2) Die Spawnposition beeinflusst die Wahl nicht. (3) Sind beide Teile intakt, kommen im Mittel beide als Ziel vor (gleiche Wahrscheinlichkeit, TECH-07). (4) Ist nur ein Teil intakt, wird dieses gewählt. (5) Die Zufallsquelle ist eine austauschbare Funktion (für Tests).
- **Testfälle:** auto: Zufallsfunktion, die 0 und 0,99 liefert → beide Teile gewählt. Nur Lokomotive intakt → Lokomotive. Unterschiedliche Spawnpositionen bei gleicher Zufallsfolge → gleiche Wahl.
- **Abhängigkeiten:** train-and-defense, architecture.
- **Entscheidungsstatus:** CONFIRMED (D-051, D-039); TECH (Wahrscheinlichkeit).

### REQ-ENM-003 – Schaden am Ziel, Despawn, abgearbeitet
- **Problemstellung:** Gegner müssen am Zug Schaden verursachen und danach verschwinden.
- **Ziel:** Ankunft → sofortiger einmaliger Schaden → Despawn → abgearbeitet.
- **Gewünschtes Verhalten:** Sobald der Gegner sein Zielteil erreicht, wendet er sofort einmalig 10 Schaden an, unabhängig vom Teil, und wird entfernt. Er zählt als abgearbeitet und für die Statistik als „hat den Zug erreicht“.
- **Akzeptanzkriterien:** (1) Genau einmal 10 Schaden. (2) Direkt danach existiert der Gegner nicht mehr. (3) Kein weiterer Schaden von diesem Gegner. (4) Er zählt als abgearbeitet und in der Statistik „Zug erreicht“ +1. (5) Der Schadenswert steht in der Gegnerkonfiguration.
- **Testfälle:** auto: Gegner erreicht die Lokomotive → 100 → 90, Gegner entfernt, Zähler +1. Gleiches am Wagon. Zweiter Schritt: keine Veränderung.
- **Abhängigkeiten:** train-and-defense (REQ-TRN-004), balance-and-statistics (REQ-STA-001), win-lose (REQ-WL-003).
- **Entscheidungsstatus:** CONFIRMED (D-052, D-015, D-050).

### REQ-ENM-004 – Zug auch ohne Spieler-Eingriff erreichbar
- **Problemstellung:** Gegner müssen nicht erst besiegt werden, damit sie Schaden verursachen.
- **Ziel:** Gegner erreichen den Zug auch ohne Eingriff.
- **Gewünschtes Verhalten:** Ohne Angriffe erreichen Gegner ihr Ziel und verursachen Schaden.
- **Akzeptanzkriterien:** In einer Simulation ohne Verteidigung erreicht jeder Gegner sein Ziel, solange Ziele intakt sind.
- **Testfälle:** auto: Simulation mit deaktivierten Angriffen.
- **Abhängigkeiten:** REQ-ENM-003.
- **Entscheidungsstatus:** CONFIRMED (D-016).

### REQ-ENM-005 – Einfache zombieartige Bewegung
- **Problemstellung:** Das Bewegungsverhalten muss bewusst einfach, vorhersagbar und testbar sein.
- **Ziel:** Gegner laufen direkt auf ihr Ziel zu.
- **Gewünschtes Verhalten:** Konstante Geschwindigkeit entlang des möglichst kürzesten Weges zum Zielteil. Kein Ausweichen vor Spieler, Angriffen oder anderen Gegnern. Gegner dürfen sich überlappen. Die Geschwindigkeit ist zu Beginn eher niedrig, der Wert wird getestet.
- **Akzeptanzkriterien:** (1) Der Weg ist der kürzeste zum Ziel (ohne Hindernisse: eine gerade Linie). (2) Die Geschwindigkeit ist ein konfigurierbarer Wert je Gegnertyp. (3) Keine Logik lenkt Gegner wegen Spieler- oder Gegnerpositionen ab. (4) Überlappende Gegner behindern sich nicht.
- **Testfälle:** auto: Gegner von A zu Ziel B braucht Weglänge/v Sekunden, Pfad ist eine Gerade. Spieler oder anderer Gegner im Weg ändert die Bahn nicht.
- **Abhängigkeiten:** REQ-ENM-002, REQ-ENM-008.
- **Entscheidungsstatus:** CONFIRMED (D-040, D-038); TESTWERT (Tempo).

### REQ-ENM-006 – Nur gültige Ziele
- **Problemstellung:** Zerstörte Zugteile dürfen nicht angegriffen werden.
- **Ziel:** Die Zielwahl schließt zerstörte Teile aus, auch bei laufender Reparatur.
- **Gewünschtes Verhalten:** Gültig sind nur intakte Zugteile (Lokomotive, Wagon). Ein zerstörtes Teil wird erst nach vollständigem Reparaturabschluss wieder gültig. Das Geschütz ist nie ein Ziel.
- **Akzeptanzkriterien:** (1) Zerstörtes Teil ist nie Ziel. (2) Gilt auch bei laufender Reparatur. (3) Wiederhergestelltes Teil ist wieder wählbar. (4) Das Geschütz ist nie Ziel.
- **Testfälle:** auto: Lokomotive zerstört → Wahl nur Wagon. Wagon zerstört, in Reparatur bei 50 → nur Lokomotive. Nach Abschluss → beide.
- **Abhängigkeiten:** train-and-defense, repair-system (REQ-REP-006).
- **Entscheidungsstatus:** CONFIRMED (D-039, D-051, D-055).

### REQ-ENM-007 – Genau ein Gegnertyp
- **Problemstellung:** Umfang begrenzen.
- **Ziel:** Ein einziger Gegnertyp mit konfigurierbaren Werten.
- **Gewünschtes Verhalten:** Alle Gegner haben denselben Typ. Werte (Lebenspunkte, Tempo, Schaden 10) stehen in der Typkonfiguration.
- **Akzeptanzkriterien:** (1) Genau ein Typ im Prototyp. (2) Werte sind Konfiguration, nicht im Logikcode. (3) Es werden keine Mechanismen für weitere Typen vorbereitet (D-059), die Werte pro Typ zu lesen ist ausreichend.
- **Testfälle:** auto: Der Wellenplan erzeugt nur Gegner dieses Typs.
- **Abhängigkeiten:** Q-004 (Testwerte).
- **Entscheidungsstatus:** CONFIRMED (D-038, D-059).

### REQ-ENM-008 – Sofortiger Zielwechsel bei Zerstörung des Ziels
- **Problemstellung:** Ein Gegner darf nicht auf ein inzwischen zerstörtes Teil zulaufen.
- **Ziel:** Neuwahl im selben Moment, in dem das Ziel zerstört wird.
- **Gewünschtes Verhalten:** Wird das gewählte Zugteil zerstört, wählt jeder darauf zielende Gegner sofort ein neues verfügbares intaktes Ziel und läuft von seiner aktuellen Position darauf zu. Sind keine intakten Teile mehr vorhanden, endet die Runde (REQ-WL-002) und es wird kein Ziel mehr gesucht.
- **Akzeptanzkriterien:** (1) Im selben Schritt, in dem ein Teil zerstört wird, haben alle Gegner mit diesem Ziel ein neues intaktes Ziel. (2) Die Bewegung geht von der aktuellen Position aus weiter. (3) Ohne intakte Teile findet keine Zielsuche statt und kein Fehler tritt auf.
- **Testfälle:** auto: 3 Gegner zielen auf den Wagon, der Wagon wird zerstört → alle 3 zielen auf die Lokomotive. Danach wird auch die Lokomotive zerstört → Runde verloren, keine Zielsuche.
- **Abhängigkeiten:** REQ-ENM-002, REQ-WL-002.
- **Entscheidungsstatus:** CONFIRMED (D-051).
