# Ressourcen

**Zweck:** Hält fest, dass Ressourcen im Prototyp bisher nicht festgelegt sind, und verhindert Spekulation.
**Zielgruppe:** Gameplay-Agent Ressourcen und alle, die Kosten/Belohnungen erwägen.
**Abhängigkeiten:** [train-and-defense.md](train-and-defense.md).

## Stand

Es ist **nichts** bestätigt. Es gibt keine bestätigten Ressourcen, keine Kosten für Bauen/Reparieren und keine Belohnungen. Ob es im ersten Prototyp überhaupt Ressourcen gibt, ist OPEN.

## Offen

- OPEN: Konkrete Ressourcen und deren Verwendung (Q-006).
- OPEN: Ob Reparieren/Bauen Ressourcen kostet (Q-006, Q-010, Q-022).
- OPEN: Upgrade- und Progressionssysteme (Q-012).

## Anforderungen

### REQ-RES-001 – Keine Ressourcenmechanik ohne Entscheidung
- **Problemstellung:** Agenten könnten Ressourcen erfinden.
- **Ziel:** Es wird kein Ressourcensystem implementiert, bis Q-006 entschieden ist.
- **Gewünschtes Verhalten:** Kein Ressourcentyp, keine Kosten, keine Belohnungen im Code.
- **Akzeptanzkriterien:** (1) Der Prototyp-Code enthält keine Ressourcenwerte. (2) Reparatur und Bau funktionieren gemäß REQ-PLR-003 ohne Ressourcenverbrauch, solange nichts anderes entschieden ist. Das ist eine technische Konsequenz der Nichtentscheidung, keine Designentscheidung.
- **Testfälle:** Code-Review und auto: Reparaturtest ohne Ressourceneingabe läuft durch.
- **Abhängigkeiten:** Q-006.
- **Entscheidungsstatus:** OPEN.
