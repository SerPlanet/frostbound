# Sieg- und Niederlagebedingungen

**Zweck:** Hält fest, was zu Sieg und Niederlage bestätigt ist (wenig) und was offen ist (das meiste).
**Zielgruppe:** Gameplay-Agent Spielablauf.
**Abhängigkeiten:** [train-and-defense.md](train-and-defense.md), [player.md](player.md).

## Bestätigt

- CONFIRMED: Der Spieler kann nicht sterben (D-011). Eine Niederlage durch Spielertod gibt es daher nicht.
- CONFIRMED: Der Prototyp hat eine größere Angriffswelle (D-019).
- CONFIRMED: Eine feste Spieldauer ist nicht die Grundlage für den Erfolg des Prototyps (D-031). Die Gegnergesamtzahl wird festgelegt (je Schwierigkeitsgrad variabel).

## Offen

- OPEN: Exakte Siegbedingung (Q-008), z. B. ob Überleben der Welle genügt, ist nicht entschieden.
- OPEN: Exakte Niederlagebedingung (Q-008). Ob und wann der Zug „zerstört“ ist und was dann passiert, steht nicht fest, ebenso Q-007.
- OPEN: Ob und wie das Ende einer Runde mit der festgelegten Gegnergesamtzahl zusammenhängt. Das gehört zur Sieg-/Niederlagebedingung (Q-008).
- OPEN: Zeitpunkt der großen Welle und der Pausen (Q-018).
- OPEN: Anzeige von Sieg/Niederlage (UI, nicht festgelegt).

## Anforderungen

### REQ-WL-001 – Keine Niederlage durch Spielertod
- **Problemstellung:** Klarstellung, dass Spielertod keine Rolle spielt.
- **Ziel:** Die Spielende-Logik hängt nicht vom Spielerzustand ab.
- **Gewünschtes Verhalten:** Siehe REQ-PLR-002.
- **Akzeptanzkriterien:** Keine Spielende-Bedingung liest einen Spieler-Lebenszustand.
- **Testfälle:** auto/Code-Review.
- **Abhängigkeiten:** player.
- **Entscheidungsstatus:** CONFIRMED (D-011).

### REQ-WL-002 – Austauschbare Siegbedingung und Niederlagebedingung
- **Problemstellung:** Bedingungen sind OPEN, sollen aber später ohne Umbau eingesetzt werden können.
- **Ziel:** Sieg- und Niederlagebedingung als austauschbare Regeln.
- **Gewünschtes Verhalten:** Die Auswertung von Spielende läuft über eine austauschbare Regel-Schnittstelle. Der Prototyp implementiert **keine** vorgeschlagene Bedingung ohne Entscheidung.
- **Akzeptanzkriterien:** (1) Bedingungen sind als Schnittstelle gekapselt. (2) Es gibt keine fest verdrahtete Sieg-/Niederlagebedingung ohne Entscheidung zu Q-008. (3) Tests verwenden ausdrücklich im Test definierte Beispielregeln.
- **Testfälle:** auto: Testregel „Ende nach N Ticks“ beendet die Runde mit dem Testergebnis.
- **Abhängigkeiten:** Q-008.
- **Entscheidungsstatus:** OPEN (die konkrete Regel). Schnittstelle: Vorschlag, PROPOSED. Eine zeitbasierte Siegbedingung (z. B. „überlebe X Sekunden“) darf nicht als Standard angenommen werden (D-031).
