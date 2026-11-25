# Offene Designfragen

**Zweck:** Zentrale Liste aller nicht entschiedenen Punkte. Zu keinem dieser Punkte gibt es verbindliche Regeln.
**Zielgruppe:** Projektverantwortlicher, Planungs-Agenten. Code-Agenten melden hier Blocker, entscheiden sie aber nicht.
**Abhängigkeiten:** keine.

Status aller Einträge: **OPEN**. Wird eine Frage entschieden: Eintrag im [Entscheidungsprotokoll](project/decision-log.md), hier auf „entschieden (D-xxx)“ setzen.

## Vom Projektverantwortlichen ausdrücklich als offen benannt

| ID | Frage | Betrifft |
|---|---|---|
| Q-001 | Konkrete Gesamtzahl der Gegner pro Schwierigkeitsgrad (dass es eine festgelegte, je Grad variierende Gesamtzahl gibt, ist entschieden: D-031) | difficulty, enemies |
| Q-002 | Exakte Spawnintervalle und Spawnverteilung über den Verlauf | core-gameplay, enemies |
| Q-003 | Exakte Zusammensetzung größerer Gegnergruppen | core-gameplay, enemies |
| Q-004 | Konkrete Gegnerwerte und Gegnertypen | enemies |
| Q-005 | Exakte Angriffsreichweite und Zielauswahl, jeweils für den Spielerangriff und für das Zuggeschütz | combat |
| Q-006 | Konkrete Ressourcen und deren Verwendung | resources |
| Q-007 | Konkrete Zug-Lebenspunkte | train-and-defense |
| Q-008 | Exakte Sieg- und Niederlagebedingungen des Prototyps | win-lose |
| Q-009 | Konkrete Reparaturgeschwindigkeit | train-and-defense, player |
| Q-010 | Konkrete Baufunktionen (was gebaut werden kann) | player, train-and-defense |
| Q-011 | Konkrete Positionierung und Abmessungen des Spielfelds | core-gameplay |
| Q-012 | Konkrete Upgrade- und Progressionssysteme | scope, resources |

## Bei der Dokumentation erkannte weitere Lücken

| ID | Frage | Betrifft |
|---|---|---|
| Q-014 | Was sind die möglichen „Zugziele“ (z. B. Lokomotive, Wagon, Teilbereiche des Zuges) und nach welcher Regel wählt ein Gegner eines? | enemies, train-and-defense |
| Q-015 | Können Gegner den Spieler blockieren oder behindern? Haben Gegner mit dem Spieler Kontakt? (Der Spieler ist unsterblich, D-011.) | enemies, player |
| Q-016 | Funktionsweise, Verteilung und Inhalte der Adventskalendertürchen (Langzeit, nicht Prototyp) | overview |
| Q-017 | Steht der Zug im Prototyp still oder bewegt er sich? Auf welcher Seite des Spielbereichs steht er? | core-gameplay, train-and-defense |
| Q-018 | Zeitpunkt der großen Angriffswelle sowie Zeitpunkt und Länge der kurzen Pausen (genauer Zeitplan). Eine feste Spieldauer ist keine offene Frage mehr: D-031 | core-gameplay |
| Q-019 | Wie wird der Schwierigkeitsgrad ausgewählt (Menü, Start) und ob außer der Gegneranzahl weitere Werte beeinflusst werden | difficulty |
| Q-020 | Konkrete Form der separaten Testmöglichkeiten (Testszenen, Startparameter, Skripte) | testing-and-greybox |
| Q-022 | Was genau repariert werden kann (Zug als Ganzes oder Teile) und was das Bauen im Prototyp erzeugt | train-and-defense, player |

## Entschiedene Fragen (zur Nachvollziehbarkeit)

| ID | Frage (Kurzfassung) | Entschieden durch | Datum |
|---|---|---|---|
| Q-013 | Verhältnis Spielerangriff und Zuggeschütz | D-030: zwei voneinander unabhängige automatische Angriffsquellen | 2026-11-25 |
| Q-021 | Branch-Modell und Commit-Konventionen | D-033: Git- und Merge-Regeln | 2026-11-25 |
| Q-018 (Teil) | Feste Spieldauer / Rundenlänge | D-031: Spieldauer ist nicht die Grundlage, stattdessen Gegnergesamtzahl. Der Rest von Q-018 (Zeitpunkt der großen Welle, Pausen) bleibt OPEN. | 2026-11-25 |
