# Spieler

**Zweck:** Beschreibt Bewegung, Spielfeldgrenzen, freie Bewegung durch Gegner, Unsterblichkeit und die Rolle des Spielers bei der Reparatur.
**Zielgruppe:** Gameplay-Agent Spieler.
**Abhängigkeiten:** [core-gameplay.md](core-gameplay.md); Angriff: [combat.md](combat.md); Reparatur: [repair-system.md](repair-system.md).

## Bestätigte Regeln (D-007, D-011, D-035, D-057)

- CONFIRMED: Der Spieler kann im Prototyp nicht sterben. Keine Spieler-Lebenspunkte, keine Todes- oder Respawn-Mechanik.
- CONFIRMED: Gegnerkontakt verursacht keine negativen Effekte. Der Spieler läuft frei durch Gegner. Gegner blockieren oder beeinflussen ihn nicht.
- CONFIRMED: Feste Bewegungsgeschwindigkeit. Keine Upgrades im Prototyp.
- CONFIRMED: Steuerung mit WASD und Pfeiltasten.
- CONFIRMED: Diagonale Bewegung ist genauso schnell wie horizontale und vertikale.
- CONFIRMED: Der Spieler kann sich nicht außerhalb des sichtbaren Spielfeldes bewegen und nicht auf den Zug gelangen. In der übrigen Spielfläche kann er sich frei bewegen, sofern keine Hindernisse vorhanden sind.
- CONFIRMED: Der Spieler greift automatisch an, ohne Angriffstaste (D-008, D-036). Details: combat.md.
- CONFIRMED: Reparatur durch Anwesenheit in der Reparaturzone, ohne zusätzliche Taste (D-056). Details: repair-system.md.

## Offen

Keine Gameplay-Fragen. Hindernisse sind nicht vorgesehen (TECH-01). Gleichzeitige gegenläufige Tasten: TECH-04. Zahlenwerte (Geschwindigkeit): Testwerte in [../technical/architecture.md](../technical/architecture.md).

## Anforderungen

### REQ-PLR-001 – Bewegung per Tastatur mit gleichmäßiger Geschwindigkeit
- **Problemstellung:** Der Spieler muss sich über das Spielfeld bewegen können, Diagonalen dürfen nicht schneller sein.
- **Ziel:** Steuerung mit WASD und Pfeiltasten, gleiche Geschwindigkeit in allen Richtungen.
- **Gewünschtes Verhalten:** W/↑ nach oben, A/← links, S/↓ unten, D/→ rechts im Top-Down-Raum. Mit zwei Richtungstasten bewegt sich der Spieler diagonal mit derselben Geschwindigkeit wie in eine Achsenrichtung.
- **Akzeptanzkriterien:** (1) Jede der 8 Tasten bewegt in die genannte Richtung. (2) Ohne Eingabe bleibt der Spieler stehen. (3) Die Geschwindigkeit ist ein fester konfigurierbarer Wert. (4) Die Länge des Bewegungsvektors pro Zeiteinheit ist bei Diagonalen gleich der bei Achsenbewegung. (5) Die Bewegung ist im Gameplay-Modul ohne Phaser testbar.
- **Testfälle:** auto: Eingabe rechts, Δt → Weg = v·Δt. Eingabe rechts+oben, Δt → Weg = v·Δt (Betrag). Keine Eingabe → keine Bewegung. manuell: alle 8 Tasten im Browser.
- **Abhängigkeiten:** architecture.
- **Entscheidungsstatus:** CONFIRMED (D-007, D-057); TESTWERT (Geschwindigkeit).

### REQ-PLR-002 – Unsterblichkeit
- **Problemstellung:** Der Prototyp hat keine Spielertod-Mechanik.
- **Ziel:** Der Spieler kann nicht sterben.
- **Gewünschtes Verhalten:** Es gibt keine Spieler-Lebenspunkte, keinen Tod, kein Respawn und keine Niederlage durch Spielertod.
- **Akzeptanzkriterien:** (1) Der Spielerzustand enthält keine Lebenspunkte. (2) Kein Ereignis, auch kein Gegnerkontakt, verändert den Spielerzustand negativ. (3) Keine Spielende-Bedingung hängt vom Spielerzustand ab.
- **Testfälle:** auto: Simulation mit vielen Gegnern auf der Spielerposition, Zustand unverändert. Code-Review.
- **Abhängigkeiten:** win-lose.
- **Entscheidungsstatus:** CONFIRMED (D-011, D-057).

### REQ-PLR-003 – Anwesenheit zur Reparatur
- **Problemstellung:** Die Reparatur setzt die Anwesenheit des Spielers in der Zone voraus.
- **Ziel:** Die Aufenthaltsbestimmung „Spieler in Zone X“ ist eindeutig.
- **Gewünschtes Verhalten:** Der Spielerzustand „befindet sich in Zone X“ wird für das Reparatursystem bereitgestellt. Es gibt keine Reparaturtaste.
- **Akzeptanzkriterien:** (1) Keine Taste und kein Befehl für Reparatur. (2) Konsistente Regel für „innerhalb“, auch am Rand (Position im Rechteck inklusive Rand, TECH).
- **Testfälle:** auto: Position innerhalb, außerhalb und auf dem Rand.
- **Abhängigkeiten:** repair-system.
- **Entscheidungsstatus:** CONFIRMED (D-056).

### REQ-PLR-004 – Freie Bewegung durch Gegner
- **Problemstellung:** Gegner sollen den Spieler nie behindern.
- **Ziel:** Keine Kollisionswirkung zwischen Spieler und Gegnern.
- **Gewünschtes Verhalten:** Der Spieler bewegt sich ungehindert durch Gegner. Gegner schieben, bremsen, blockieren oder schädigen ihn nicht.
- **Akzeptanzkriterien:** (1) Die Spielerposition nach einem Schritt ist unabhängig von Gegnern. (2) Keine Gegnerlogik liest oder verändert den Spielerzustand. (3) Spieler und Gegner können dieselbe Position einnehmen.
- **Testfälle:** auto: Spieler läuft durch eine Gegnermenge, Position = Position ohne Gegner.
- **Abhängigkeiten:** enemies.
- **Entscheidungsstatus:** CONFIRMED (D-035, D-057).

### REQ-PLR-005 – Spielfeldgrenzen und Zug als Sperrzone
- **Problemstellung:** Der Spieler darf das Spielfeld nicht verlassen und nicht auf den Zug gelangen.
- **Ziel:** Begrenzte Bewegungsfläche.
- **Gewünschtes Verhalten:** Die Spielerposition wird auf die begehbare Fläche beschränkt: das sichtbare Spielfeld ohne den Zugbereich. Es gibt keine weiteren Hindernisse.
- **Akzeptanzkriterien:** (1) Die Spielerposition liegt nach jedem Schritt innerhalb des Spielfeldes. (2) Sie liegt nie im Zugbereich. (3) An der Grenze wird die Bewegung begrenzt, ohne dass die Geschwindigkeitsregeln anderer Richtungen verletzt werden (Gleiten entlang der Grenze ist zulässig).
- **Testfälle:** auto: Dauerhafte Eingabe in jede Richtung → Position bleibt in der begehbaren Fläche. Position an jeder Grenze geprüft.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-001, REQ-CORE-004), train-and-defense (REQ-TRN-002).
- **Entscheidungsstatus:** CONFIRMED (D-057).
