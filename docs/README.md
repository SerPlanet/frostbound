# FROSTBOUND – Dokumentationsübersicht

**Zweck:** Einstiegspunkt und Index aller Projektdokumente.
**Zielgruppe:** Alle Agenten und Menschen. Für die Auswahl der Dokumente je Aufgabe siehe [agent-guide.md](agent-guide.md).
**Stand des Projekts:** Planungsphase für einen ersten Gameplay-Prototyp. Es existiert noch kein Spielcode.

## Statuslegende (gilt in allen Dokumenten)

| Status | Bedeutung |
|---|---|
| **CONFIRMED** | Vom Projektverantwortlichen ausdrücklich bestätigt. Verbindlich. |
| **PROPOSED** | Vorschlag, nicht bestätigt. Darf nicht als Anforderung umgesetzt werden. |
| **OPEN** | Nicht entschieden. Nicht eigenmächtig entscheiden, nicht raten. |

Jede Aussage mit Spielbezug trägt einen dieser Status. Aussagen ohne Status sind reine Erläuterungen ohne Anforderungscharakter.

## Dokumentübersicht

Spalte „Zusätzlich lesen“: Dokumente, die man für ein vollständiges Verständnis ergänzend braucht. Jedes Dokument ist für sich lesbar, die Zusatzdokumente vertiefen nur.

| Dokument | Zweck | Dok.-Status | Zielgruppe / Agent | Zusätzlich lesen |
|---|---|---|---|---|
| [agent-guide.md](agent-guide.md) | Welche Dokumente für welche Aufgabe | aktiv | alle Agenten | – |
| [project/overview.md](project/overview.md) | Vision, Kontext, Langzeitvision Adventskalender | aktiv | alle | – |
| [project/process.md](project/process.md) | Entwicklungsprozess und Dokumentationsregeln | aktiv (Prozess PROPOSED) | alle, Doku-Agenten | – |
| [project/decision-log.md](project/decision-log.md) | Bestätigte Entscheidungen und Änderungen | aktiv | alle, Doku-Agenten | – |
| [open-questions.md](open-questions.md) | Zentrale Liste offener Designfragen | aktiv | Projektverantwortlicher, Planungs-Agenten | – |
| [prototype/scope.md](prototype/scope.md) | Ziele, Umfang, Nicht-Umfang des Prototyps | aktiv | alle | – |
| [prototype/core-gameplay.md](prototype/core-gameplay.md) | Spielfeld, Spielablauf, Angriffsverlauf | aktiv | Gameplay-Agenten | scope |
| [prototype/player.md](prototype/player.md) | Spieler: Bewegung, Bauen/Reparieren durch Nähe | aktiv | Agent Spieler | core-gameplay |
| [prototype/enemies.md](prototype/enemies.md) | Gegnerverhalten: Spawn, Zielwahl, Schaden, Despawn | aktiv | Agent Gegner | core-gameplay |
| [prototype/combat.md](prototype/combat.md) | Automatische Angriffe, Zuggeschütz, Zielauswahl | aktiv | Agent Kampf | player, enemies |
| [prototype/train-and-defense.md](prototype/train-and-defense.md) | Zug, Schaden am Zug, Verteidigung, Reparatur | aktiv | Agent Zug | enemies, resources |
| [prototype/resources.md](prototype/resources.md) | Ressourcen (vollständig OPEN) | aktiv | Agent Ressourcen | train-and-defense |
| [prototype/difficulty.md](prototype/difficulty.md) | Schwierigkeitsgrade | aktiv | Balancing-Agent | enemies |
| [prototype/win-lose.md](prototype/win-lose.md) | Sieg- und Niederlagebedingungen (überwiegend OPEN) | aktiv | Agent Spielablauf | train-and-defense |
| [technical/architecture.md](technical/architecture.md) | Architekturanforderungen, Trennung Gameplay/Darstellung/Szenen | aktiv | alle Code-Agenten | – |
| [technical/testing-and-greybox.md](technical/testing-and-greybox.md) | Testbarkeit und Greyboxing | aktiv | Code- und Test-Agenten | architecture |

## Konventionen

- Entscheidungs-IDs: `D-xxx` ([Entscheidungsprotokoll](project/decision-log.md)). Offene Fragen: `Q-xxx` ([open-questions.md](open-questions.md)).
- Ein neuer Agent liest zuerst [agent-guide.md](agent-guide.md), nicht alle Dokumente.
- Der GitHub-Pages-Workflow veröffentlicht das gesamte Repository. Die Dokumente sind damit öffentlich einsehbar. Das bestehende Pages-Setup wurde nicht verändert.
