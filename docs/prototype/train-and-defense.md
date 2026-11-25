# Zug und Verteidigung

**Zweck:** Beschreibt den Zug (Lokomotive, Wagon), den Schaden am Zug und die Reparatur.
**Zielgruppe:** Gameplay-Agent Zug.
**Abhängigkeiten:** [enemies.md](enemies.md), [player.md](player.md); [resources.md](resources.md) (nur OPEN).

## Bestätigte Regeln

- CONFIRMED: Der Zug steht im Mittelpunkt (D-004).
- CONFIRMED: Der Prototyp hat eine Lokomotive und einen einzelnen Wagon (D-005).
- CONFIRMED: Der Zug befindet sich an einer Seite des Spielbereichs (D-012).
- CONFIRMED: Gegner verursachen am Zugziel Schaden (D-015).
- CONFIRMED: Reparieren durch Nähe, Fortschritt pausiert bei Entfernung (D-020).
- CONFIRMED: Das Zuggeschütz ist Teil der Verteidigung (D-009).

## Offen

- OPEN: Zug-Lebenspunkte, ob gesamt, je Lokomotive/Wagon oder je Zugziel (Q-007, Q-014).
- OPEN: Reparaturgeschwindigkeit (Q-009), Reparatur-/Baukosten (Q-006, Q-010, Q-022).
- OPEN: Ob der Zug im Prototyp still steht oder fährt (Q-017). Position des Geschützes am Zug.

## Anforderungen

### REQ-TRN-001 – Zugaufbau
- **Problemstellung:** Der Prototyp braucht einen definierten Zug.
- **Ziel:** Lokomotive und genau ein Wagon.
- **Gewünschtes Verhalten:** Der Zug besteht aus genau einer Lokomotive und einem Wagon, dargestellt als Greybox-Formen.
- **Akzeptanzkriterien:** (1) Zugmodell enthält genau 1 Lokomotive und genau 1 Wagon. (2) Beide existieren in der Gameplay-Logik unabhängig von der Darstellung. (3) Die Darstellung nutzt einfache geometrische Formen.
- **Testfälle:** auto: Zug-Initialisierung → 2 Zugteile mit den Typen Lokomotive/Wagon. manuell: Greybox zeigt zwei Formen.
- **Abhängigkeiten:** architecture, testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-005, D-006).

### REQ-TRN-002 – Schadensannahme am Zug
- **Problemstellung:** Gegnerschaden muss sich auf den Zugzustand auswirken.
- **Ziel:** Der Zug nimmt Schaden an dem Ziel, das ein Gegner erreicht hat.
- **Gewünschtes Verhalten:** Wird Schaden angewendet, sinkt der Gesundheitswert des betroffenen Zugziels um den Schadenswert.
- **Akzeptanzkriterien:** (1) Schaden verringert den Gesundheitswert genau um den Schadenswert. (2) Gesundheit sinkt nicht unter den von der Logik definierten Mindestwert (Verhalten bei 0 hängt von Q-008 ab, OPEN). (3) Gesundheit und Schaden sind Konfiguration.
- **Testfälle:** auto: Zugziel mit Testgesundheit H, Schaden S → H−S.
- **Abhängigkeiten:** Q-007, Q-014, Q-008.
- **Entscheidungsstatus:** CONFIRMED (D-015, Prinzip); OPEN (Werte, Verhalten bei 0).

### REQ-TRN-003 – Reparatur durch Nähe
- **Problemstellung:** Beschädigter Zug soll reparierbar sein, ohne Zusatztaste.
- **Ziel:** Reparaturfortschritt durch Anwesenheit des Spielers.
- **Gewünschtes Verhalten:** Gemäß REQ-PLR-003 wird ein beschädigtes Zugziel repariert, solange der Spieler nahe genug steht. Der Fortschritt pausiert bei Entfernung.
- **Akzeptanzkriterien:** Es gelten alle Kriterien von REQ-PLR-003 für das Reparaturziel. Reparatur erhöht die Gesundheit nicht über das Maximum.
- **Testfälle:** auto: siehe REQ-PLR-003 mit beschädigtem Zugziel; Gesundheit ≤ Maximum.
- **Abhängigkeiten:** player (REQ-PLR-003), Q-009, Q-022.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-020); OPEN (Geschwindigkeit, Kosten, Ziele).
