# Gegner

**Zweck:** Beschreibt Spawnverhalten, Zielwahl, Schaden und Despawn der Gegner.
**Zielgruppe:** Gameplay-Agent Gegner.
**Abhängigkeiten:** [core-gameplay.md](core-gameplay.md); Schaden am Zug: [train-and-defense.md](train-and-defense.md); Gegneranzahl: [difficulty.md](difficulty.md).

## Bestätigte Regeln

- CONFIRMED: Gegner starten auf der dem Zug gegenüberliegenden Seite. Sie können außerhalb des sichtbaren Bereichs spawnen und laufen dann ins Spielfeld. Sie erscheinen nicht mitten im sichtbaren Spielfeld (D-013).
- CONFIRMED: Gegner wählen unabhängig von ihrer Spawnposition ein Zugziel, bereits während der Bewegung (D-014).
- CONFIRMED: Erreicht ein Gegner sein Zugziel, verursacht er dort Schaden und despawnt (D-015).
- CONFIRMED: Der Spieler muss nicht jeden Gegner besiegen, bevor er den Zug erreicht (D-016).

## Offen

- OPEN: Gegnertypen und -werte (Lebenspunkte, Tempo, Schaden), Q-004.
- OPEN: Was „Zugziele“ sind und nach welcher Regel gewählt wird, Q-014.
- OPEN: Interaktion mit dem Spieler (Blockieren, Kontakt), Q-015.
- CONFIRMED: Die Gesamtzahl der Gegner wird festgelegt und kann je Schwierigkeitsgrad variieren (D-031).
- OPEN: Konkrete Gesamtzahl pro Schwierigkeit (Q-001), Spawnintervalle und -verteilung (Q-002), Gruppen (Q-003).
- Hinweis: „Theoretisch außerhalb des sichtbaren Bereichs“ bedeutet, dass das erlaubt ist. Ob es im Prototyp tatsächlich genutzt wird, ist nicht festgelegt (OPEN, Q-011).

## Anforderungen

### REQ-ENM-001 – Spawn auf der Gegenseite, nicht im sichtbaren Feld
- **Problemstellung:** Gegner dürfen nicht „aus dem Nichts“ im sichtbaren Spielfeld erscheinen.
- **Ziel:** Spawn auf der Gegenseite des Zuges und Eintritt ins Spielfeld durch Bewegung.
- **Gewünschtes Verhalten:** Spawnpositionen liegen auf der dem Zug gegenüberliegenden Seite und dürfen außerhalb des sichtbaren Bereichs liegen. Von dort laufen die Gegner ins Spielfeld.
- **Akzeptanzkriterien:** (1) Jede Spawnposition liegt auf der Gegenseite des Zuges. (2) Keine Spawnposition liegt innerhalb des sichtbaren Spielfeldbereichs. (3) Ein gespawnter Gegner bewegt sich ab Tick 1 in Richtung Spielfeld/Zug. (4) Spawnpositionen kommen aus Konfiguration.
- **Testfälle:** auto: Viele Spawns mit Testkonfiguration (Testdaten), Prüfung gegen sichtbares Rechteck und Zugseite. manuell: Greybox-Lauf, Gegner treten von außerhalb ein.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-001), Q-011.
- **Entscheidungsstatus:** CONFIRMED (D-013); OPEN (Werte).

### REQ-ENM-002 – Zugzielwahl während der Bewegung
- **Problemstellung:** Das Ziel soll unabhängig vom Spawnort und früh feststehen.
- **Ziel:** Jeder Gegner hat ein Zugziel, das er schon während der Bewegung gewählt hat.
- **Gewünschtes Verhalten:** Die Wahl des Zugziels ist von der Spawnposition unabhängig und erfolgt bereits unterwegs, nicht erst bei Ankunft.
- **Akzeptanzkriterien:** (1) Jeder aktive Gegner hat spätestens während der Bewegung ein Zugziel gesetzt. (2) Die Zielwahl nutzt die Spawnposition nicht als Eingabe. (3) Die Auswahlregel ist als austauschbare Strategie gekapselt, da sie OPEN ist.
- **Testfälle:** auto: Gleiche Konfiguration und gleicher Zufalls-Seed mit unterschiedlichen Spawnpositionen liefert dieselbe Zielwahlverteilung bzw. dieselbe Entscheidung. auto: Nach einigen Ticks hat jeder Gegner ein Ziel.
- **Abhängigkeiten:** Q-014 (welche Ziele, welche Regel).
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-014); OPEN (Regel).

### REQ-ENM-003 – Schaden am Ziel und Despawn
- **Problemstellung:** Gegner müssen Schaden am Zug verursachen und danach verschwinden.
- **Ziel:** Ankunft am Zugziel → Schaden → Despawn.
- **Gewünschtes Verhalten:** Beim Erreichen des Zugziels wird einmalig Schaden am Zug (dem gewählten Ziel) angewendet, danach wird der Gegner entfernt.
- **Akzeptanzkriterien:** (1) Bei Erreichen wird genau einmal Schaden angewendet. (2) Direkt danach existiert der Gegner nicht mehr. (3) Die Schadenshöhe stammt aus der Gegnerkonfiguration (Wert OPEN). (4) Kein weiterer Schaden von diesem Gegner danach.
- **Testfälle:** auto: Gegner an Zielposition → Zugzustand um konfigurierten Schaden verändert, Gegner entfernt; zweiter Tick: keine weitere Veränderung.
- **Abhängigkeiten:** train-and-defense (Schadensannahme), Q-004, Q-007.
- **Entscheidungsstatus:** CONFIRMED (D-015); OPEN (Werte).

### REQ-ENM-004 – Zug erreichbar ohne Spieler-Kill
- **Problemstellung:** Gegner müssen nicht erst besiegt werden, damit sie Schaden verursachen können.
- **Ziel:** Gegner erreichen den Zug auch ohne Eingriff.
- **Gewünschtes Verhalten:** Ohne Angriff durch Spieler oder Geschütz erreichen Gegner ihr Ziel und verursachen Schaden.
- **Akzeptanzkriterien:** In einer Simulation ohne Verteidigung erreicht jeder Gegner sein Ziel und verursacht Schaden.
- **Testfälle:** auto: Simulation mit deaktivierten Angriffen.
- **Abhängigkeiten:** REQ-ENM-003.
- **Entscheidungsstatus:** CONFIRMED (D-016).
