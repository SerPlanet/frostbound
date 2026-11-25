# Ressourcen

**Zweck:** Hält fest, was zu Ressourcen im Prototyp gilt (fast nichts) und was die Langzeitvision vorsieht. Verhindert, dass Vollspiel-Mechaniken in den Prototyp wandern.
**Zielgruppe:** Gameplay-Agent Ressourcen und alle, die Kosten oder Belohnungen erwägen.
**Abhängigkeiten:** [repair-system.md](repair-system.md), [../project/overview.md](../project/overview.md).

## Prototyp

- CONFIRMED: Reparaturen kosten keine Ressourcen (D-043).
- CONFIRMED: Progressionsmechaniken (Belohnungen, Freischaltungen, Upgrades, Ressourcen als Spielsystem) gehören nicht zum ersten Prototyp (D-046).
- CONFIRMED (optional): Gegnerdrops und Einsammeln können optional umgesetzt werden, haben niedrige Priorität und dürfen den Kernprototyp nicht verzögern (D-046).
- OPEN: Ob Drops und Einsammeln im Prototyp tatsächlich umgesetzt werden und wie sie funktionieren (Q-006).
- OPEN: Baukosten. Im Prototyp gibt es nichts zu bauen (Q-010, zur Bestätigung).

## Vollspiel (nicht Teil des Prototyps)

Die folgenden Punkte sind ausschließlich Langzeitplanung.

- CONFIRMED: Das Vollspiel soll später drei Ressourcen besitzen (D-046).
- OPEN: Die endgültigen drei Ressourcen und ihre genaue Verwendung. Genannte Kandidaten: Kohle, Essen, Geld, Eisen (Q-006).
- CONFIRMED als Grundidee, Ausgestaltung OPEN (D-046): Ressourcen durch Gegnerdrops, Fundstücke und Wellenabschlussbelohnungen. Türchenbelohnungen zu Beginn eines Tages. Kostenlose Freischaltung neuer Waffen, Upgrades oder Fähigkeiten. Teilweise Auswahl zwischen zwei Belohnungen. Begrenzte Ressourcen erzwingen Entscheidungen darüber, welche Wagons und Waffen verbessert werden.
- OPEN: Upgrade- und Progressionssysteme (Q-012), Türchen (Q-016).

## Anforderungen

### REQ-RES-001 – Keine Progressionsmechanik im Prototyp
- **Problemstellung:** Agenten könnten Vollspiel-Mechaniken in den Prototyp ziehen.
- **Ziel:** Der Prototyp enthält keine Progression.
- **Gewünschtes Verhalten:** Kein Ressourcenspeicher als Spielsystem, keine Belohnungen, keine Freischaltungen, keine Upgrades.
- **Akzeptanzkriterien:** (1) Der Prototyp-Code enthält keine Ressourcenwerte, Belohnungen, Freischaltungen oder Upgrades. (2) Reparatur läuft ohne Ressourcenbezug (REQ-REP-001).
- **Testfälle:** Code-Review. auto: Reparaturtest ohne Ressourceneingabe läuft durch.
- **Abhängigkeiten:** Q-006, Q-012.
- **Entscheidungsstatus:** CONFIRMED (D-046, D-043).

### REQ-RES-002 – Gegnerdrops und Einsammeln (optional, niedrige Priorität)
- **Problemstellung:** Optionaler Zusatz, der den Kern nicht verzögern darf.
- **Ziel:** Falls umgesetzt, funktionieren Drops und Einsammeln ohne den Kern zu beeinflussen.
- **Gewünschtes Verhalten:** Nicht festgelegt. Eine Spezifikation (was droppt, wie wird eingesammelt, wofür) liegt nicht vor.
- **Akzeptanzkriterien:** (1) Es wird nichts implementiert, bevor das Verhalten (Q-006) festgelegt und freigegeben ist. (2) Der Kernprototyp ist ohne diese Funktion vollständig.
- **Testfälle:** Entfallen, bis spezifiziert.
- **Abhängigkeiten:** Q-006.
- **Entscheidungsstatus:** CONFIRMED (optional, niedrige Priorität, D-046); OPEN (Verhalten).
