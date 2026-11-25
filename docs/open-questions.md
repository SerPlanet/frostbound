# Offene Designfragen

**Zweck:** Zentrale Liste aller nicht entschiedenen Punkte. Zu keinem dieser Punkte gibt es verbindliche Regeln.
**Zielgruppe:** Projektverantwortlicher, Planungs-Agenten. Code-Agenten melden hier Blocker, entscheiden sie aber nicht.
**Abhängigkeiten:** keine.

Status aller Einträge: **OPEN**. Wird eine Frage entschieden: Eintrag im [Entscheidungsprotokoll](project/decision-log.md), hier auf „entschieden (D-xxx)“ setzen.

## Vom Projektverantwortlichen ausdrücklich als offen benannt

| ID | Frage | Betrifft |
|---|---|---|
| Q-001 | Exakte Gegneranzahl pro Schwierigkeitsgrad | difficulty, enemies |
| Q-002 | Exakte Spawnintervalle | core-gameplay, enemies |
| Q-003 | Exakte Zusammensetzung größerer Gegnergruppen | core-gameplay, enemies |
| Q-004 | Konkrete Gegnerwerte und Gegnertypen | enemies |
| Q-005 | Exakte Angriffsreichweite und Zielauswahl des Spielers bzw. Geschützes | combat |
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
| Q-013 | Verhältnis „Spieler greift automatisch an“ und „automatisches Zuggeschütz“: Sind es zwei Angriffsquellen (Spielerwaffe und Geschütz) oder ist das Geschütz die Angriffsform des Spielers? | player, combat |
| Q-014 | Was sind die möglichen „Zugziele“ (z. B. Lokomotive, Wagon, Teilbereiche des Zuges) und nach welcher Regel wählt ein Gegner eines? | enemies, train-and-defense |
| Q-015 | Können Gegner den Spieler blockieren oder behindern? Haben Gegner mit dem Spieler Kontakt? (Der Spieler ist unsterblich, D-011.) | enemies, player |
| Q-016 | Funktionsweise, Verteilung und Inhalte der Adventskalendertürchen (Langzeit, nicht Prototyp) | overview |
| Q-017 | Steht der Zug im Prototyp still oder bewegt er sich? Auf welcher Seite des Spielbereichs steht er? | core-gameplay, train-and-defense |
| Q-018 | Dauer einer Prototyprunde, Zeitpunkt und Länge der Pausen, Zeitpunkt der größeren Welle | core-gameplay, win-lose |
| Q-019 | Wie wird der Schwierigkeitsgrad ausgewählt (Menü, Start) und ob außer der Gegneranzahl weitere Werte beeinflusst werden | difficulty |
| Q-020 | Konkrete Form der separaten Testmöglichkeiten (Testszenen, Startparameter, Skripte) | testing-and-greybox |
| Q-021 | Branch-Modell und Commit-Konventionen für die Entwicklung | process |
| Q-022 | Was genau repariert werden kann (Zug als Ganzes oder Teile) und was das Bauen im Prototyp erzeugt | train-and-defense, player |
