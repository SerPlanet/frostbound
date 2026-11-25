# Spieler

**Zweck:** Beschreibt Bewegung, Unsterblichkeit sowie Bauen/Reparieren durch Nähe des Spielers.
**Zielgruppe:** Gameplay-Agent Spieler.
**Abhängigkeiten:** [core-gameplay.md](core-gameplay.md); für Angriff [combat.md](combat.md); für Reparaturziel [train-and-defense.md](train-and-defense.md).

## Bestätigte Regeln

- CONFIRMED: Bewegung über WASD und Pfeiltasten (D-007).
- CONFIRMED: Der Spieler besitzt einen eigenen automatischen Angriff, unabhängig vom Zuggeschütz (D-008, D-030). Details siehe combat.md.
- CONFIRMED: Der Spieler kann nicht sterben (D-011).
- CONFIRMED: Bauen und Reparieren durch Nähe, ohne zusätzliche Taste. Entfernt sich der Spieler, pausiert der Arbeitsfortschritt (D-020).

## Offen

- OPEN: Bewegungsgeschwindigkeit und Spielerwerte (nicht festgelegt).
- OPEN: Reparaturgeschwindigkeit (Q-009), Baufunktionen (Q-010, Q-022), Nähe-Radius.
- OPEN: Reichweite und Zielwahl des Spielerangriffs (Q-005); ob Gegner den Spieler behindern (Q-015).

## Anforderungen

### REQ-PLR-001 – Bewegung per Tastatur
- **Problemstellung:** Der Spieler muss sich über das Spielfeld bewegen können.
- **Ziel:** Steuerung mit WASD und Pfeiltasten.
- **Gewünschtes Verhalten:** W/↑ nach oben, A/← links, S/↓ unten, D/→ rechts, im Top-Down-Raum. Verhalten bei gleichzeitigen oder gegenläufigen Tasten sowie die Diagonalgeschwindigkeit sind nicht festgelegt (OPEN, Detail der Spielerwerte) und werden nicht eigenmächtig entschieden.
- **Akzeptanzkriterien:** (1) Jede der 8 Tasten bewegt den Spieler in die genannte Richtung. (2) Ohne Eingabe bleibt der Spieler stehen. (3) Die Bewegung hängt von einem konfigurierbaren Geschwindigkeitswert ab (kein fester Wert in der Logik). (4) Bewegung ist im Gameplay-Modul ohne Phaser-Szene testbar (siehe architecture).
- **Testfälle:** auto: Eingabe-Abstraktion (Richtungsvektor) liefert pro Taste/Kombination den erwarteten Vektor; Positionsupdate über Δt stimmt mit v·Δt überein. manuell: Alle 8 Tasten im Browser ausprobieren.
- **Abhängigkeiten:** architecture (Input getrennt von Logik).
- **Entscheidungsstatus:** CONFIRMED (Tasten); OPEN (Geschwindigkeit).

### REQ-PLR-002 – Unsterblichkeit
- **Problemstellung:** Der Prototyp hat keine Spielertod-Mechanik.
- **Ziel:** Der Spieler kann nicht sterben.
- **Gewünschtes Verhalten:** Es gibt keinen Spieler-Lebenspunktewert und keine Spielerniederlage durch Tod.
- **Akzeptanzkriterien:** Kein Gegner, Projektil oder Ereignis verändert einen Spielerzustand zu „tot“. Es existiert keine Game-Over-Bedingung, die vom Spielerzustand abhängt.
- **Testfälle:** auto: Simulation mit vielen Gegnern über lange Zeit, Spielerzustand bleibt „lebendig“. 
- **Abhängigkeiten:** win-lose.
- **Entscheidungsstatus:** CONFIRMED (D-011).

### REQ-PLR-003 – Bauen/Reparieren durch Nähe
- **Problemstellung:** Bauen und Reparieren soll ohne zusätzliche Eingabe funktionieren und pausieren, wenn der Spieler weggeht.
- **Ziel:** Arbeitsfortschritt hängt von der Anwesenheit des Spielers in Nähe des Objekts ab.
- **Gewünschtes Verhalten:** Steht der Spieler innerhalb des Nähebereichs des Objekts, schreitet Arbeitsfortschritt voran. Verlässt er den Bereich, pausiert der Fortschritt (bleibt erhalten, setzt nicht zurück). Kehrt er zurück, geht es weiter.
- **Akzeptanzkriterien:** (1) Es ist keine Taste nötig. (2) Fortschritt steigt nur, solange der Spieler im Nähebereich ist. (3) Beim Verlassen bleibt der erreichte Fortschritt unverändert und steigt nicht weiter. (4) Beim Zurückkehren wird vom erreichten Fortschritt fortgesetzt. (5) Radius und Geschwindigkeit sind Konfiguration.
- **Testfälle:** auto: Spieler in Nähe, Δt → Fortschritt steigt um rate·Δt; Spieler außerhalb → unverändert; wieder rein → setzt fort. manuell: Im Greybox-Lauf neben dem Objekt stehen, weggehen, zurückkehren.
- **Abhängigkeiten:** train-and-defense (Reparatur), Q-009, Q-010, Q-022.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-020); OPEN (Werte, Reparatur-/Bauziele).
