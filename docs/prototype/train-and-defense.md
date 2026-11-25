# Zug und Verteidigung

**Zweck:** Beschreibt den Zug (Lokomotive, Wagon, Geschütz), Lebenspunkte, Schadensannahme, Zerstörung und die Abhängigkeit zwischen Wagon und Geschütz.
**Zielgruppe:** Gameplay-Agent Zug.
**Abhängigkeiten:** [enemies.md](enemies.md), [repair-system.md](repair-system.md), [win-lose.md](win-lose.md). Begriffe: [../project/glossary.md](../project/glossary.md).

## Bestätigte Regeln

- CONFIRMED: Der Zug steht im Mittelpunkt (D-004). Er steht still am unteren Rand, der Spielbereich liegt darüber (D-034).
- CONFIRMED: Der Prototyp besteht aus genau einer Lokomotive, einem Wagon und einem Geschütz. Das Geschütz befindet sich auf dem Wagon. Die Lokomotive hat kein eigenes Geschütz (D-054).
- CONFIRMED: Startwerte: Lokomotive 100 HP, Wagon 100 HP, Geschütz 20 HP, Standardschaden eines Gegners 10 (D-053). Keine unveränderlichen Balancewerte für die Vollversion. Die 20 HP des Geschützes sind im Prototyp nicht durch Gegnerangriffe gefährdet.
- CONFIRMED: Jedes Zugteil hat eigene Lebenspunkte, Lokomotive und Wagon werden separat beschädigt (D-041).
- CONFIRMED: Beschädigte Wagons behalten ihre Funktion, vollständig zerstörte verlieren sie. Die Funktion kehrt erst nach vollständigem Abschluss der Reparatur zurück (D-041).
- CONFIRMED: Wird der Wagon zerstört, ist auch das darauf montierte Geschütz zerstört und nicht funktionsfähig. Die Reparatur des zerstörten Wagons stellt Wagon und Geschütz gemeinsam vollständig wieder her (Geschütz 20/20, vorheriger Zustand irrelevant). Ist der Wagon nur beschädigt, bleiben Wagon und Geschütz unabhängig voneinander funktionsfähig (D-055).
- CONFIRMED: Die Lokomotive hat im Prototyp keine Zusatzfunktion (D-041).
- CONFIRMED: Gegner verursachen am Zugziel 10 Schaden (D-052). Zerstörte Zugteile sind keine gültigen Ziele (D-039).
- CONFIRMED: Spätere Geschütze auf der Lokomotive, weitere Waggons und Upgrades sind nicht Teil des Prototyps (D-054, D-059).
- CONFIRMED **Zugausrichtung** (D-061, gilt für das gesamte Spiel, auch für die grafische Gestaltung): Der Zug fährt immer von links nach rechts. Die Lokomotive steht immer ganz rechts, ihre Front zeigt nach rechts (Fahrtrichtung). Alle Wagen stehen links von der Lokomotive. Weitere Wagen werden später links ergänzt.

## Offen

Keine Gameplay-Fragen. Eine separate Geschützreparatur ist für den Prototyp nicht erforderlich (D-055).

## Anforderungen

### REQ-TRN-001 – Zugaufbau
- **Problemstellung:** Der Prototyp braucht einen definierten Zug.
- **Ziel:** Lokomotive, Wagon und ein Geschütz auf dem Wagon.
- **Gewünschtes Verhalten:** Der Zug besteht aus genau einer Lokomotive und einem Wagon. Auf dem Wagon ist genau ein Geschütz montiert. Die Lokomotive trägt kein Geschütz. Darstellung als Greybox-Formen.
- **Akzeptanzkriterien:** (1) Das Zugmodell enthält genau 1 Lokomotive, 1 Wagon und 1 Geschütz. (2) Das Geschütz gehört zum Wagon. (3) Es existiert kein Geschütz an der Lokomotive. (4) Das Modell existiert in der Gameplay-Logik unabhängig von der Darstellung.
- **Testfälle:** auto: Zug-Initialisierung → Teile: Lokomotive, Wagon, Geschütz (am Wagon). manuell: Greybox zeigt Lokomotive, Wagon und Geschütz auf dem Wagon.
- **Abhängigkeiten:** architecture, testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-005, D-054).

### REQ-TRN-002 – Zug steht still am unteren Rand
- **Problemstellung:** Die Lage des Zuges muss feststehen.
- **Ziel:** Stillstehender Zug am unteren Spielfeldrand.
- **Gewünschtes Verhalten:** Position des Zuges ändert sich während einer Runde nicht. Der Spieler kann ihn nicht betreten.
- **Akzeptanzkriterien:** (1) Positionen konstant über die Runde. (2) Zug am unteren Rand. (3) Keine Bewegungslogik für den Zug.
- **Testfälle:** auto: Positionsvergleich Rundenstart/Rundenende.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-001), player (REQ-PLR-001).
- **Entscheidungsstatus:** CONFIRMED (D-034, D-057).

### REQ-TRN-003 – Lebenspunkte und Zerstörungszustand
- **Problemstellung:** Zugteile müssen getrennt Schaden nehmen und zerstört werden können. Ein Teil bleibt auch während seiner Reparatur zerstört.
- **Ziel:** Lebenspunkte und ein eigener Zerstörungsstatus je Zugteil.
- **Gewünschtes Verhalten:** Jedes Zugteil (Lokomotive, Wagon) hat aktuelle und maximale Lebenspunkte (Start: je 100) und einen Zerstörungsstatus. Erreichen die Lebenspunkte 0, wird das Teil zerstört. Es bleibt zerstört, auch während die Lebenspunkte durch Reparatur wieder steigen, bis die Reparatur vollständig abgeschlossen ist (volle Lebenspunkte). Ein Teil ist **intakt**, wenn es nicht zerstört ist (auch wenn es beschädigt ist).
- **Akzeptanzkriterien:** (1) Schaden auf ein Teil verändert die Lebenspunkte der anderen nicht. (2) Lebenspunkte sinken nie unter 0 und steigen nie über das Maximum. (3) Bei 0 Lebenspunkten wird der Status „zerstört“ gesetzt. (4) Während der Reparatur eines zerstörten Teils bleibt der Status „zerstört“, bis die Lebenspunkte das Maximum erreichen. (5) Beschädigt und intakt = Lebenspunkte unter dem Maximum, nicht zerstört.
- **Testfälle:** auto: Schaden auf die Lokomotive → nur sie verliert. Schaden über den Restwert → 0 und zerstört. Repariert auf 50 → noch zerstört. Repariert auf 100 → nicht mehr zerstört.
- **Abhängigkeiten:** repair-system.
- **Entscheidungsstatus:** CONFIRMED (D-041, D-053, D-039); der Status während der Reparatur folgt aus D-039/D-041.

### REQ-TRN-004 – Schadensannahme am Zug
- **Problemstellung:** Gegnerschaden muss sich auf das erreichte Zugteil auswirken.
- **Ziel:** Das erreichte Zugteil nimmt 10 Schaden.
- **Gewünschtes Verhalten:** Erreicht ein Gegner sein Zugteil, werden einmalig 10 Schadenspunkte angewendet, unabhängig davon, ob Lokomotive oder Wagon getroffen wird.
- **Akzeptanzkriterien:** (1) Die Lebenspunkte des getroffenen Teils sinken um 10 (nicht unter 0). (2) Der Schaden ist für Lokomotive und Wagon identisch. (3) Der angerichtete Schaden wird je Zugteil für die Statistik erfasst. (4) Ein Teil, das auf 0 sinkt, wird sofort zerstört (REQ-TRN-003) und das Geschütz mit dem Wagon (REQ-TRN-005).
- **Testfälle:** auto: Teil mit 100 → 90. Teil mit 5 → 0 und zerstört. Gleicher Schaden an Lokomotive und Wagon.
- **Abhängigkeiten:** enemies (REQ-ENM-003), balance-and-statistics (REQ-STA-001).
- **Entscheidungsstatus:** CONFIRMED (D-052).

### REQ-TRN-005 – Funktionszustand und Wagon-Geschütz-Abhängigkeit
- **Problemstellung:** Wagon und Geschütz sind gekoppelt, aber nur in bestimmten Fällen.
- **Ziel:** Eindeutiger Funktionszustand für Wagon und Geschütz.
- **Gewünschtes Verhalten:** (a) Ein beschädigter, nicht zerstörter Wagon ist voll funktionsfähig, sein Geschütz ebenfalls. (b) Wird der Wagon zerstört, ist sein Geschütz zerstört und funktionslos. (c) Mit dem vollständigen Abschluss der Wagon-Reparatur sind Wagon und Geschütz wieder funktionsfähig, das Geschütz hat 20/20 HP, unabhängig von seinem vorherigen Zustand. (d) Die Lokomotive hat keine Zusatzfunktion. (e) Das Geschütz wird im Prototyp nicht von Gegnern angegriffen und verliert Lebenspunkte nur über die Zerstörung des Wagons.
- **Akzeptanzkriterien:** (1) Wagon beschädigt, nicht zerstört → Geschütz funktionsfähig. (2) Wagon zerstört → Geschütz im selben Schritt zerstört und funktionslos. (3) Während der Wagon-Reparatur ist das Geschütz weiter funktionslos. (4) Bei Abschluss: Wagon intakt, Geschütz funktionsfähig mit 20/20. (5) Gegnerangriffe können das Geschütz nicht als Ziel wählen. (6) Es gibt keine separate Geschützreparatur.
- **Testfälle:** auto: Wagon auf 10 HP → Geschütz feuert. Wagon 0 → Geschütz feuert nicht. Reparatur bei 95 → Geschütz funktionslos. Reparatur bei 100 → Geschütz funktionsfähig, 20/20.
- **Abhängigkeiten:** repair-system (REQ-REP-005), combat (REQ-CMB-002).
- **Entscheidungsstatus:** CONFIRMED (D-054, D-055, D-041).

### REQ-TRN-006 – Zugausrichtung und Reihenfolge der Zugteile
- **Problemstellung:** Die Anordnung des Zuges ist eine verbindliche Gestaltungsregel und darf nicht als zufällige Platzierung der Platzhalter gelten.
- **Ziel:** Der Zug fährt von links nach rechts, die Lokomotive führt.
- **Gewünschtes Verhalten:** Die Lokomotive steht ganz rechts am Zug, ihre Front zeigt nach rechts (Fahrtrichtung). Alle Wagen stehen links von ihr. Das Geschütz sitzt auf dem Wagon und damit links von der Lokomotive. Reparaturzonen liegen über ihrem Teil. Die Darstellung kennzeichnet die Front der Lokomotive eindeutig (in der Greybox: dunkler Frontblock mit Pfeil nach rechts).
- **Akzeptanzkriterien:** (1) Die Ausrichtung ist in der Konfiguration festgelegt („rechts“) und wird von der Darstellung gelesen. (2) Die Lokomotive hat die größte x-Position aller Zugteile und liegt am rechten Ende des Zuges. (3) Der Wagon liegt links von der Lokomotive, das Geschütz auf dem Wagon. (4) Die Front der Lokomotive wird rechts dargestellt. (5) Schadenszuordnung, HP-Anzeigen, Geschütz und Reparaturzonen folgen den Teilen (die Zuordnung hängt am Rechteck des Teils, nicht an seiner Position im Zug). (6) Spätere Wagen kämen links hinzu. Das wird im Prototyp nicht vorbereitet.
- **Testfälle:** auto: Ausrichtung „rechts“, Lokomotive ganz rechts, Wagon links, Geschütz auf dem Wagon, Zonen über den Teilen, Schadenszuordnung links/rechts, Gegner laufen zu ihrem Ziel auf der richtigen Seite. manuell: Greybox ansehen, Front und Pfeil der Lokomotive zeigen nach rechts.
- **Abhängigkeiten:** REQ-TRN-001, REQ-REP-002, architecture (TECH-08).
- **Entscheidungsstatus:** CONFIRMED (D-061).
