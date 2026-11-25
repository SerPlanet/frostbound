# Offene Designfragen

**Zweck:** Zentrale Liste aller nicht entschiedenen Punkte. Zu keinem dieser Punkte gibt es verbindliche Regeln.
**Zielgruppe:** Projektverantwortlicher, Planungs-Agenten. Code-Agenten melden hier Blocker, entscheiden sie aber nicht.
**Abhängigkeiten:** keine.

Status aller Einträge in den ersten beiden Tabellen: **OPEN**. Wird eine Frage entschieden: Eintrag im [Entscheidungsprotokoll](project/decision-log.md), hier in die Tabelle „Entschiedene Fragen“ verschieben.

Legende „Art“: **Struktur** = muss für die Prototyp-Spezifikation entschieden sein. **Tuning** = Zahlenwert, für den vorläufige Startwerte genügen und der anhand von Tests angepasst wird (D-045). **Langzeit** = betrifft das Vollspiel, nicht den Prototyp.

## Offen: Spielsysteme

| ID | Frage | Art | Betrifft | Hängt ab von |
|---|---|---|---|---|
| Q-001 | Konkrete Gesamtzahl der Gegner je Schwierigkeitsgrad (dass es eine festgelegte, je Grad variierende Gesamtzahl gibt, ist entschieden: D-031) | Tuning | difficulty, enemies | Q-004 |
| Q-002 | Konkrete Spawnintervalle und Spawnverteilung (die Verlaufsform ist entschieden: D-045) | Tuning | core-gameplay, enemies | Q-001, Q-004 |
| Q-003 | Konkrete Gruppengrößen und Zusammensetzung größerer Gruppen | Tuning | core-gameplay, enemies | Q-004 |
| Q-004 | Konkrete Gegnerwerte: Lebenspunkte, Tempo (zu Beginn eher niedrig, D-038), Schaden. Die Typanzahl ist entschieden: genau ein Typ | Tuning | enemies, combat | – |
| Q-005 | Konkreter Reichweitenwert des Spielerangriffs („stark begrenzt“, D-036). Bedeutung von „geeignet“ für das Zuggeschütz und Bezugspunkt für „nächstes“ Ziel bei Vollfeldreichweite | Tuning / Struktur | combat | Q-004, Q-025 |
| Q-006 | Ressourcen: endgültige drei Ressourcen des Vollspiels und ihre Verwendung; ob Gegnerdrops und Einsammeln im Prototyp umgesetzt werden (optional, niedrige Priorität, D-046) | Langzeit / optional | resources | – |
| Q-007 | Konkrete Lebenspunkte je Zugteil (die Struktur „eigene Lebenspunkte je Teil“ ist entschieden: D-041) | Tuning | train-and-defense | – |
| Q-009 | Konkrete Reparaturgeschwindigkeit | Tuning | repair-system | Q-027 |
| Q-010 | Baufunktionen: Gibt es im Prototyp etwas zu bauen, und was? Baukosten (Reparaturen sind kostenlos, D-043) | Struktur | player, train-and-defense | Q-006 |
| Q-011 | Abmessungen des Spielfelds, Abmessungen des sichtbaren Bereichs, ob es Hindernisse gibt (Position von Zug und Spielbereich ist entschieden: D-034) | Struktur | core-gameplay | – |
| Q-018 | Konkreter Zeitpunkt der großen Angriffswelle sowie Zeitpunkt und Länge der kurzen Pausen (die Verlaufsform ist entschieden: D-045) | Tuning | core-gameplay | Q-001 bis Q-003 |
| Q-019 | Welche weiteren Werte der Schwierigkeitsgrad außer der Gegneranzahl beeinflusst; voreingestellter Grad auf dem Auswahlbildschirm (Auswahl selbst ist entschieden: D-047) | Struktur | difficulty, ui-and-flow | Q-001 |
| Q-023 | Details der Zielwahl: gleiche Wahrscheinlichkeit für Lokomotive und Wagon? Zielpunkt am Zugteil? Was passiert, wenn das gewählte Ziel auf dem Weg zerstört wird (Neuwahl)? | Struktur | enemies | – |
| Q-024 | Sieg: Zählen Gegner, die den Zug erreicht und despawnt haben, als „erledigt“? Ohne Antwort ist unklar, ob ein Sieg nach einem Durchbruch überhaupt erreichbar ist | Struktur | win-lose, statistics | – |
| Q-025 | Geschütze: Anzahl, Montageort (Wagon oder Lokomotive), Lebenspunkte, wie ein Geschütz zerstört wird (Gegner zielen nur auf Lokomotive und Wagon), Funktion eines zerstörten Wagons im Prototyp | Struktur | train-and-defense, combat, repair-system | Q-023 |
| Q-026 | Reparaturbereiche: Form, Größe, Lage, Darstellung; Priorität bei Überlappung außerhalb der bestätigten Regeln (z. B. Lokomotive und Wagon); Bedeutung von „intakt“ (hier gelesen als „nicht vollständig zerstört“) | Struktur | repair-system | Q-025 |
| Q-027 | Wirkung der Reparatur bei beschädigten (nicht zerstörten) Objekten: Wächst die Lebensenergie fortlaufend oder gibt es einen Fortschrittsbalken mit Abschluss? Verhältnis Reparaturfortschritt zu Lebenspunkten | Struktur | repair-system, train-and-defense | – |
| Q-028 | Trefferart der Angriffe: Projektil oder Soforttreffer, Projektilgeschwindigkeit, Verfehlen | Struktur | combat | – |

## Offen: Ablauf, Technik, Langzeit

| ID | Frage | Art | Betrifft | Hängt ab von |
|---|---|---|---|---|
| Q-012 | Konkrete Upgrade- und Progressionssysteme des Vollspiels (Progressionsmechaniken sind nicht Teil des Prototyps: D-046, die Frage bleibt für das Vollspiel offen) | Langzeit | resources, overview | Q-006 |
| Q-016 | Funktionsweise, Verteilung und Inhalte der Adventskalendertürchen | Langzeit | overview | Q-012 |
| Q-020 | Konkrete Form der separaten Testmöglichkeiten (Testszenen, Startparameter, Skripte) | Struktur (Architektur) | testing-and-greybox | Architektur |
| Q-029 | HUD-Inhalte, Details des Startbildschirms, Darstellung der Rundenstatistik | Struktur | ui-and-flow | – |
| Q-030 | Beziehung der Begriffe „Runde“ und „Spieltag“ (der Zug steht „während eines Spieltages“ still, D-034) | Struktur | glossary, core-gameplay | – |
| Q-031 | Zielplattform: Browser, Auflösung, Eingabegeräte (z. B. Touch) | Struktur (Architektur) | ui-and-flow, architecture | – |
| Q-032 | Audio im Prototyp: ja oder nein, Umfang. Audio gilt weder als bestätigt noch als ausgeschlossen | Struktur (niedrige Priorität) | scope | – |

## Entschiedene Fragen

| ID | Frage (Kurzfassung) | Entschieden durch | Datum |
|---|---|---|---|
| Q-008 | Sieg- und Niederlagebedingungen | D-042 (Niederlage), D-044 (Sieg). Folgefrage: Q-024 | 2026-11-25 |
| Q-013 | Verhältnis Spielerangriff und Zuggeschütz | D-030: zwei voneinander unabhängige Angriffsquellen | 2026-11-25 |
| Q-014 | Zugziele und Wahlregel | D-039: Lokomotive oder Wagon, zufällig. Folgefrage: Q-023 | 2026-11-25 |
| Q-015 | Blockieren Gegner den Spieler? | D-035: Nein, der Spieler bewegt sich frei durch Gegner | 2026-11-25 |
| Q-017 | Zug still oder fahrend, Seite | D-034: still während eines Spieltages, am unteren Rand | 2026-11-25 |
| Q-021 | Branch-Modell und Commit-Konventionen | D-033: Git- und Merge-Regeln | 2026-11-25 |
| Q-022 | Was repariert werden kann | D-043: jedes reparierbare Objekt mit eigenem Reparaturbereich. Folgefragen: Q-025, Q-026, Q-027 | 2026-11-25 |
| Q-018 (Teil) | Feste Spieldauer | D-031: nicht die Grundlage, stattdessen Gegnergesamtzahl. Zeitpunkte bleiben OPEN | 2026-11-25 |
| Q-004 (Teil) | Anzahl der Gegnertypen | D-038: genau ein Typ im Prototyp. Werte bleiben OPEN | 2026-11-25 |
| Q-005 (Teil) | Zielwahl des Spielers, Reichweite des Geschützes | D-036 (nächster Gegner in Reichweite), D-037 (gesamtes Spielfeld). Reichweitenwert, „geeignet“ bleiben OPEN | 2026-11-25 |
| Q-011 (Teil) | Position von Zug und Spielbereich | D-034. Abmessungen bleiben OPEN | 2026-11-25 |
| Q-019 (Teil) | Wie wird der Schwierigkeitsgrad gewählt | D-047: Auswahl im Spielablauf nach dem Startbildschirm | 2026-11-25 |
| Q-006 (Teil) | Reparaturkosten | D-043: Reparaturen kosten keine Ressourcen | 2026-11-25 |
| Q-007 (Teil) | Struktur der Zug-Lebenspunkte | D-041: eigene Lebenspunkte je Zugteil | 2026-11-25 |
