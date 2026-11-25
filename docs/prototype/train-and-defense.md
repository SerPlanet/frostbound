# Zug und Verteidigung

**Zweck:** Beschreibt den Zug (Lokomotive, Wagon), Lebenspunkte je Zugteil, Schadensannahme, Zerstörung und Funktionsverlust.
**Zielgruppe:** Gameplay-Agent Zug.
**Abhängigkeiten:** [enemies.md](enemies.md), [repair-system.md](repair-system.md), [win-lose.md](win-lose.md). Begriffe: [../project/glossary.md](../project/glossary.md).

## Bestätigte Regeln

- CONFIRMED: Der Zug steht im Mittelpunkt (D-004). Er steht während eines Spieltages still, am unteren Rand, der Spielbereich liegt darüber (D-034).
- CONFIRMED: Im Prototyp gibt es eine Lokomotive und einen Wagon (D-005).
- CONFIRMED: Jedes Zugteil besitzt eigene Lebenspunkte. Lokomotive und Wagon werden separat beschädigt (D-041).
- CONFIRMED: Beschädigte Wagons behalten ihre Funktion. Vollständig zerstörte Wagons verlieren ihre Funktion (D-041).
- CONFIRMED: Ein zerstörter Wagon kann repariert werden. Seine Funktion wird erst nach vollständigem Abschluss der Reparatur wiederhergestellt (D-041, D-043).
- CONFIRMED: Die Lokomotive hat eigene Lebenspunkte und im ersten Prototyp keine besondere Zusatzfunktion. Spätere Spezialfähigkeiten oder Waffen auf der Lokomotive sind denkbar (D-041).
- CONFIRMED: Gegner verursachen am Zugziel Schaden (D-015). Zerstörte Zugteile sind keine gültigen Ziele (D-039).
- CONFIRMED: Das Zuggeschütz ist Teil der Verteidigung (D-009, D-037).
- CONFIRMED: Game Over, wenn alle Zugteile zerstört sind (D-042), siehe win-lose.md.

## Offen

- OPEN (Tuning): Lebenspunkte je Zugteil (Q-007).
- OPEN: Anzahl, Montageort und Zerstörungsmechanik der Geschütze, Bedeutung der „Funktion“ eines Wagons im Prototyp (Q-025). Hinweis: Die Bestätigung nennt „montierte Geschütze“ auf Wagons. Ob und welches Geschütz auf welchem Zugteil steht, ist nicht festgelegt.
- OPEN: Bauen: was gebaut werden kann (Q-010).

## Anforderungen

### REQ-TRN-001 – Zugaufbau
- **Problemstellung:** Der Prototyp braucht einen definierten Zug.
- **Ziel:** Lokomotive und genau ein Wagon.
- **Gewünschtes Verhalten:** Der Zug besteht aus genau einer Lokomotive und einem Wagon, dargestellt als Greybox-Formen.
- **Akzeptanzkriterien:** (1) Das Zugmodell enthält genau 1 Lokomotive und genau 1 Wagon. (2) Beide existieren in der Gameplay-Logik unabhängig von der Darstellung. (3) Die Darstellung nutzt einfache geometrische Formen.
- **Testfälle:** auto: Zug-Initialisierung → 2 Zugteile (Lokomotive, Wagon). manuell: Greybox zeigt zwei Formen.
- **Abhängigkeiten:** architecture, testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-005, D-006).

### REQ-TRN-002 – Zug steht still am unteren Rand
- **Problemstellung:** Die Lage des Zuges muss feststehen.
- **Ziel:** Stillstehender Zug am unteren Spielfeldrand.
- **Gewünschtes Verhalten:** Position und Ausrichtung des Zuges ändern sich während einer Runde nicht.
- **Akzeptanzkriterien:** (1) Die Position der Zugteile ist über die gesamte Runde konstant. (2) Der Zug liegt am unteren Spielfeldrand. (3) Es gibt keine Bewegungslogik für den Zug.
- **Testfälle:** auto: Positionsvergleich Rundenstart/Rundenende.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-001).
- **Entscheidungsstatus:** CONFIRMED (D-034).

### REQ-TRN-003 – Lebenspunkte je Zugteil und Zerstörung
- **Problemstellung:** Zugteile müssen getrennt Schaden nehmen und zerstört werden können.
- **Ziel:** Eigene Lebenspunkte je Zugteil mit definiertem Zerstörungszustand.
- **Gewünschtes Verhalten:** Jedes Zugteil hat aktuelle und maximale Lebenspunkte. Schaden wirkt nur auf das getroffene Teil. Bei 0 Lebenspunkten ist das Teil vollständig zerstört.
- **Akzeptanzkriterien:** (1) Schaden auf ein Teil verändert die Lebenspunkte der anderen Teile nicht. (2) Lebenspunkte sinken nie unter 0. (3) Bei 0 gilt das Teil als zerstört. (4) Maximalwerte sind Konfiguration je Teil. (5) Beschädigt, nicht zerstört = Lebenspunkte > 0 und < Maximum.
- **Testfälle:** auto: Schaden S auf Lokomotive → nur Lokomotive verliert. Schaden ≥ aktuelle Lebenspunkte → zerstört, Wert 0, nicht negativ.
- **Abhängigkeiten:** Q-007.
- **Entscheidungsstatus:** CONFIRMED (D-041); OPEN (Werte).

### REQ-TRN-004 – Schadensannahme am Zug
- **Problemstellung:** Gegnerschaden muss sich auf das gewählte Zugteil auswirken.
- **Ziel:** Das erreichte Zugziel nimmt Schaden.
- **Gewünschtes Verhalten:** Wird Gegnerschaden angewendet, sinken die Lebenspunkte genau des betroffenen Zugteils.
- **Akzeptanzkriterien:** (1) Schaden verringert die Lebenspunkte des betroffenen Teils um den Schadenswert (gedeckelt bei 0). (2) Schaden auf ein bereits zerstörtes Teil kann nicht entstehen, da es kein gültiges Ziel ist (Neuwahl bei Zerstörung unterwegs: Q-023). (3) Der angerichtete Schaden wird je Zugteil für die Rundenstatistik erfasst.
- **Testfälle:** auto: Zugteil mit Testlebenspunkten H, Schaden S → max(H−S, 0). Statistik-Zähler Schaden je Teil + S.
- **Abhängigkeiten:** enemies (REQ-ENM-003), balance-and-statistics (REQ-STA-001), Q-023.
- **Entscheidungsstatus:** CONFIRMED (D-015, D-041); OPEN (Werte, Verhalten bei Zerstörung unterwegs).

### REQ-TRN-005 – Funktionszustand von Lokomotive und Wagon
- **Problemstellung:** Zerstörte Wagons verlieren ihre Funktion, beschädigte nicht.
- **Ziel:** Ein eindeutiger Funktionszustand je Zugteil.
- **Gewünschtes Verhalten:** Ein beschädigter, nicht zerstörter Wagon ist voll funktionsfähig. Ein vollständig zerstörter Wagon hat keine Funktion, bis seine Reparatur vollständig abgeschlossen ist. Die Lokomotive hat im Prototyp keine Zusatzfunktion.
- **Akzeptanzkriterien:** (1) Funktion aktiv ⇔ Lebenspunkte > 0 (für Wagons), mit der Ausnahme, dass nach Zerstörung die Funktion erst bei vollständigem Reparaturabschluss wieder aktiv wird (siehe REQ-REP-005). (2) Beschädigung allein verändert die Funktion nie. (3) Für die Lokomotive ist keine Zusatzfunktion implementiert.
- **Testfälle:** auto: Wagon bei 1 Lebenspunkt → Funktion aktiv. Wagon bei 0 → inaktiv. Reparatur bei 99 % → inaktiv, bei Abschluss → aktiv.
- **Abhängigkeiten:** repair-system, Q-025 (was die Funktion eines Wagons im Prototyp umfasst).
- **Entscheidungsstatus:** CONFIRMED (D-041); OPEN (Inhalt der Funktion, Q-025).

## Anmerkung

Reparatur und Bauen sind in [repair-system.md](repair-system.md) bzw. [player.md](player.md) beschrieben.
