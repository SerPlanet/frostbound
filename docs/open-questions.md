# Offene Designfragen

**Zweck:** Zentrale Liste aller nicht oder nur vorläufig entschiedenen Punkte.
**Zielgruppe:** Projektverantwortlicher, Planungs-Agenten. Code-Agenten melden hier Blocker, entscheiden sie aber nicht.
**Abhängigkeiten:** keine.

Legende: **OPEN** = nicht entschieden. **TESTWERT** = vorläufiger Zahlenwert zum Testen (wird anhand von Spieltests angepasst, D-045). **TECH** = technische Entscheidung des ausführenden Agenten im Rahmen von D-060, revidierbar, ohne Änderung bestätigter Gameplay-Regeln (Quelle: [technical/architecture.md](technical/architecture.md)).

## Noch offen: Gameplay (Stand nach Phase 1)

Nichts davon blockiert den Start der Prototyp-Implementierung. Für alle Zahlenwerte existieren vorläufige Testwerte (siehe architecture.md, Abschnitt Testwerte).

| ID | Frage | Art | Betrifft |
|---|---|---|---|
| Q-001 | Endgültige Gesamtzahl der Gegner je Schwierigkeitsgrad | TESTWERT | difficulty |
| Q-002 | Endgültige Spawnintervalle und Spawnverteilung | TESTWERT | difficulty, enemies |
| Q-003 | Endgültige Gruppengrößen | TESTWERT | difficulty, enemies |
| Q-004 | Endgültige Gegnerwerte: Lebenspunkte und Tempo (Schaden ist entschieden: 10, D-052) | TESTWERT | enemies, combat |
| Q-005 | Endgültige Reichweite des Spielerangriffs, Schaden und Feuerrate beider Angriffsquellen | TESTWERT | combat |
| Q-018 | Endgültiger Zeitpunkt der großen Welle sowie Zeitpunkt und Länge der Pausen | TESTWERT | difficulty |
| Q-010 | Gibt es im Prototyp etwas zu bauen? Bauen durch Nähe ist bestätigt (D-020). Da zusätzliche Waggons und Geschütze nicht zum Prototyp gehören (D-059), geht die Spezifikation davon aus: nein. Bitte bestätigen | OPEN (nicht blockierend) | player, train-and-defense |
| Q-006 | Drops und Einsammeln im Prototyp (optional, niedrige Priorität, D-046). Endgültige drei Ressourcen des Vollspiels | OPEN (nicht blockierend) | resources |
| Q-030 | Beziehung der Begriffe „Runde“ und „Spieltag“ | OPEN (nicht blockierend) | glossary |
| Q-032 | Audio im Prototyp (weder bestätigt noch ausgeschlossen, im Plan nicht enthalten) | OPEN (nicht blockierend) | scope |
| Q-012 | Upgrade- und Progressionssysteme des Vollspiels (nicht Prototyp, D-059) | Langzeit | resources, overview |
| Q-016 | Funktionsweise, Verteilung und Inhalte der Adventskalendertürchen | Langzeit | overview |

## Technisch entschieden, im Spieltest zu prüfen (TECH, revidierbar)

Diese Punkte sind pragmatisch festgelegt, damit die Implementierung starten kann. Sie verändern keine bestätigte Regel, sollten aber beim ersten Test beurteilt werden.

| ID | Frage | TECH-Entscheidung (siehe architecture.md) |
|---|---|---|
| Q-005 (Teil) | Was ist für das Geschütz „geeignet“, was ist der Bezugspunkt für „nächstes“ Ziel | geeignet = lebender Gegner im Spielfeld. Bezugspunkt = Position des Geschützes (TECH-05) |
| Q-028 | Trefferart | Soforttreffer ohne Projektil, kurze Trefferlinie nur als Darstellung (TECH-06) |
| Q-023 (Teil) | Wahrscheinlichkeiten und Treffpunkt der Zielwahl | gleiche Wahrscheinlichkeit je verfügbarem intakten Zugteil, „erreicht“ = Gegnerposition innerhalb des Zugteil-Rechtecks (TECH-07) |
| Q-026 | Reparaturzonen: Form, Größe, Lage | Rechtecke oberhalb der Zugteile, nicht überlappend (TECH-09). Balance-Teststand 4: Länge wie ursprünglich, Höhe vorläufig 60 statt 120 (TESTWERT), siehe architecture.md |
| Q-011 | Spielfeldmaße, Hindernisse | logische Größe 1280×720, keine Hindernisse (TECH-01) |
| Q-019 | Weitere von der Schwierigkeit beeinflusste Werte, voreingestellter Grad | Nur die Wellenplan-Daten (Gesamtzahl) unterscheiden sich, keine Voreinstellung (TECH-12) |
| Q-029 | HUD-Inhalte, Startbildschirm-Details | HUD siehe TECH-11 |
| Q-031 | Zielplattform | Desktop-Browser mit Tastatur, kein Touch (TECH-02) |
| Q-020 | Form der Testmöglichkeiten | Modi per URL-Parameter, Selbsttest-Seite ohne Framework (TECH-13) |

## Entschiedene Fragen (CONFIRMED)

| ID | Frage (Kurzfassung) | Entschieden durch | Datum |
|---|---|---|---|
| Q-007 | Zug-Lebenspunkte | D-053: Lokomotive 100, Wagon 100, Geschütz 20 | 2026-11-25 |
| Q-008 | Sieg- und Niederlagebedingungen | D-042, D-044, D-050 | 2026-11-25 |
| Q-009 | Reparaturgeschwindigkeit | D-056: 5 HP alle 5 Sekunden | 2026-11-25 |
| Q-013 | Spielerangriff und Zuggeschütz | D-030: zwei unabhängige Quellen | 2026-11-25 |
| Q-014 | Zugziele und Wahlregel | D-039, D-051 | 2026-11-25 |
| Q-015 | Blockieren Gegner den Spieler? | D-035, D-057: nein | 2026-11-25 |
| Q-017 | Zug still oder fahrend, Seite | D-034: still, unterer Rand | 2026-11-25 |
| Q-021 | Branch-Modell | D-033 | 2026-11-25 |
| Q-022 | Was repariert werden kann | D-043, D-056 | 2026-11-25 |
| Q-023 | Zielwahl: Neuwahl bei Zerstörung | D-051 (Details: TECH) | 2026-11-25 |
| Q-024 | Zählen Durchbrüche für den Sieg? | D-050: ja, Gegner gelten nach Schaden und Verschwinden als abgearbeitet | 2026-11-25 |
| Q-025 | Geschütze: Anzahl, Montageort, Zerstörung | D-054, D-055: ein Geschütz auf dem Wagon, zerstört mit dem Wagon | 2026-11-25 |
| Q-027 | Reparaturwirkung bei beschädigten Objekten | D-056: gleiche 5-HP-Schritte | 2026-11-25 |
| Q-011 (Teil) | Position, Seitenverhältnis | D-034, D-058: 16:9 | 2026-11-25 |
| Q-031 (Teil) | Skalierung | D-058: proportional | 2026-11-25 |
| Q-004 (Teil) | Anzahl der Typen, Schaden | D-038 (ein Typ), D-052 (Schaden 10) | 2026-11-25 |
| Q-018 (Teil) | Feste Spieldauer | D-031 | 2026-11-25 |
