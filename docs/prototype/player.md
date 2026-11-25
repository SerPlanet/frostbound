# Spieler

**Zweck:** Beschreibt Bewegung, freie Bewegung durch Gegner, Unsterblichkeit und die Rolle des Spielers bei der Reparatur.
**Zielgruppe:** Gameplay-Agent Spieler.
**Abhängigkeiten:** [core-gameplay.md](core-gameplay.md); Angriff: [combat.md](combat.md); Reparatur: [repair-system.md](repair-system.md).

## Bestätigte Regeln

- CONFIRMED: Bewegung über WASD und Pfeiltasten (D-007).
- CONFIRMED: Der Spieler kann sich frei durch Gegner bewegen. Gegner blockieren oder beeinflussen ihn nicht (D-035).
- CONFIRMED: Der Spieler greift automatisch an, es gibt keine manuelle Angriffstaste (D-008, D-036). Details: combat.md.
- CONFIRMED: Der Spieler kann nicht sterben (D-011).
- CONFIRMED: Reparatur durch Anwesenheit im Reparaturbereich, ohne zusätzliche Taste (D-020, D-043). Details: repair-system.md.

## Offen

- OPEN (Tuning): Bewegungsgeschwindigkeit und Spielerwerte. Startposition des Spielers (Q-011).
- OPEN: Verhalten bei gleichzeitigen oder gegenläufigen Tasten und Diagonalgeschwindigkeit (Detail der Spielerwerte, wird nicht eigenmächtig entschieden).
- OPEN: Bauen: was gebaut werden kann (Q-010).

## Anforderungen

### REQ-PLR-001 – Bewegung per Tastatur
- **Problemstellung:** Der Spieler muss sich über das Spielfeld bewegen können.
- **Ziel:** Steuerung mit WASD und Pfeiltasten.
- **Gewünschtes Verhalten:** W/↑ nach oben, A/← links, S/↓ unten, D/→ rechts im Top-Down-Raum. Gleichzeitige und gegenläufige Tasten sowie Diagonalgeschwindigkeit sind nicht festgelegt.
- **Akzeptanzkriterien:** (1) Jede der 8 Tasten bewegt den Spieler in die genannte Richtung. (2) Ohne Eingabe bleibt der Spieler stehen. (3) Die Geschwindigkeit ist ein konfigurierbarer Wert. (4) Die Bewegung ist im Gameplay-Modul ohne Phaser-Szene testbar. (5) Der Spieler kann das Spielfeld nicht verlassen.
- **Testfälle:** auto: Eingabe-Abstraktion liefert pro Taste den erwarteten Richtungsvektor. Positionsupdate über Δt = v·Δt. Spieler an der Spielfeldgrenze wird nicht hinausbewegt. manuell: alle 8 Tasten im Browser.
- **Abhängigkeiten:** architecture, Q-011 (Spielfeldgrenzen).
- **Entscheidungsstatus:** CONFIRMED (Tasten, D-007); OPEN (Geschwindigkeit, Kombinationen).

### REQ-PLR-002 – Unsterblichkeit
- **Problemstellung:** Der Prototyp hat keine Spielertod-Mechanik.
- **Ziel:** Der Spieler kann nicht sterben.
- **Gewünschtes Verhalten:** Es gibt keine Spieler-Lebenspunkte und keine Niederlage durch Spielertod.
- **Akzeptanzkriterien:** Kein Ereignis verändert einen Spielerzustand zu „tot“. Keine Spielende-Bedingung hängt vom Spielerzustand ab.
- **Testfälle:** auto: Simulation mit vielen Gegnern über lange Zeit, Spielerzustand bleibt „lebendig“.
- **Abhängigkeiten:** win-lose.
- **Entscheidungsstatus:** CONFIRMED (D-011).

### REQ-PLR-003 – Anwesenheit zur Reparatur
- **Problemstellung:** Die Reparatur setzt die Anwesenheit des Spielers voraus.
- **Ziel:** Der Spielerzustand „befindet sich im Reparaturbereich X“ ist eindeutig bestimmbar und ausreichend.
- **Gewünschtes Verhalten:** Steht der Spieler im Reparaturbereich eines Objekts, wird dieser Zustand für das Reparatursystem bereitgestellt. Der Spieler benötigt keine Taste.
- **Akzeptanzkriterien:** (1) Es existiert keine Taste und kein Befehl für Reparatur. (2) Die Aufenthaltsbestimmung ist eindeutig, auch am Rand eines Bereichs (konsistente Regel für „innerhalb“). (3) Die Reparaturlogik selbst liegt im Reparatursystem (REQ-REP-003, REQ-REP-004).
- **Testfälle:** auto: Spielerposition innerhalb/außerhalb → richtiger Zustand, inkl. Grenzfall.
- **Abhängigkeiten:** repair-system, Q-026.
- **Entscheidungsstatus:** CONFIRMED (D-020, D-043).

### REQ-PLR-004 – Freie Bewegung durch Gegner
- **Problemstellung:** Gegner sollen den Spieler nie behindern.
- **Ziel:** Keine Kollisionswirkung zwischen Spieler und Gegnern.
- **Gewünschtes Verhalten:** Der Spieler bewegt sich ungehindert durch Gegner. Gegner schieben, bremsen, blockieren oder schädigen ihn nicht und beeinflussen sein Verhalten nicht.
- **Akzeptanzkriterien:** (1) Die Spielerposition nach einem Bewegungsschritt ist unabhängig von Anzahl und Lage der Gegner. (2) Keine Gegnerlogik liest oder verändert Spielerzustand. (3) Der Spieler kann sich an derselben Position wie ein Gegner befinden.
- **Testfälle:** auto: Spieler läuft durch eine Gegnermenge, Position = erwartete Position ohne Gegner. auto: Gegner auf Spielerposition → Spielerzustand unverändert.
- **Abhängigkeiten:** enemies.
- **Entscheidungsstatus:** CONFIRMED (D-035).
