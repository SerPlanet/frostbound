# FROSTBOUND – Dokumentationsübersicht

**Zweck:** Einstiegspunkt und Index aller Projektdokumente.
**Zielgruppe:** Alle Agenten und Menschen. Für die Auswahl der Dokumente je Aufgabe siehe [agent-guide.md](agent-guide.md).
**Abhängigkeiten:** keine.
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
| [project/overview.md](project/overview.md) | Vision, Kontext, Langzeitvision (Adventskalender, Ressourcen) | aktiv | alle | – |
| [project/process.md](project/process.md) | Entwicklungsreihenfolge, Git-/Merge-Regeln, Dokumentationsregeln, Anforderungsstandard, Definition of Done | aktiv (Prozess, Git-Regeln CONFIRMED) | alle, Doku-Agenten | – |
| [project/decision-log.md](project/decision-log.md) | Bestätigte Entscheidungen und Änderungen | aktiv | alle, Doku-Agenten | – |
| [project/glossary.md](project/glossary.md) | Einheitliche Begriffe | aktiv | alle | – |
| [open-questions.md](open-questions.md) | Zentrale Liste offener Designfragen, Abhängigkeiten, entschiedene Fragen | aktiv | Projektverantwortlicher, Planungs-Agenten | – |
| [prototype/scope.md](prototype/scope.md) | Ziele, Umfang, Nicht-Umfang des Prototyps | aktiv | alle | – |
| [prototype/core-gameplay.md](prototype/core-gameplay.md) | Spielfeldaufbau, Angriffsverlauf auf Basis der Gegnergesamtzahl | aktiv | Gameplay-Agenten | scope |
| [prototype/player.md](prototype/player.md) | Spieler: Bewegung, freie Bewegung, Unsterblichkeit | aktiv | Agent Spieler | core-gameplay |
| [prototype/enemies.md](prototype/enemies.md) | Gegner: Typ, Spawn, Bewegung, Zielwahl, Schaden, Despawn | aktiv | Agent Gegner | core-gameplay |
| [prototype/combat.md](prototype/combat.md) | Zwei unabhängige automatische Angriffsquellen, Treffer, Besiegen | aktiv | Agent Kampf | player, enemies |
| [prototype/train-and-defense.md](prototype/train-and-defense.md) | Zugteile, Lebenspunkte, Schaden, Funktionsverlust | aktiv | Agent Zug | enemies, repair-system |
| [prototype/repair-system.md](prototype/repair-system.md) | Reparaturbereiche, automatische Reparatur, Prioritäten | aktiv | Agent Reparatur | train-and-defense, player |
| [prototype/resources.md](prototype/resources.md) | Ressourcen: Prototyp (keine Progression) und Vollspiel-Vision | aktiv | Agent Ressourcen | repair-system |
| [prototype/difficulty.md](prototype/difficulty.md) | Schwierigkeitsgrade, vorläufige Startwerte (PROPOSED) | aktiv | Balancing-Agent | enemies, balance-and-statistics |
| [prototype/win-lose.md](prototype/win-lose.md) | Sieg- und Niederlagebedingungen | aktiv | Agent Spielablauf | train-and-defense |
| [prototype/ui-and-flow.md](prototype/ui-and-flow.md) | Spielablauf, Startbildschirm, Schwierigkeitswahl, HUD, Ergebnisbildschirm | aktiv | Agent Spielablauf/UI | win-lose, difficulty |
| [prototype/balance-and-statistics.md](prototype/balance-and-statistics.md) | Einfaches Balance-Modell, Rundenstatistik | aktiv | Balancing-Agent, Agent Statistik | combat, enemies, repair-system |
| [technical/architecture.md](technical/architecture.md) | Architekturanforderungen, Trennung Gameplay/Darstellung/Szenen | aktiv | alle Code-Agenten | – |
| [technical/testing-and-greybox.md](technical/testing-and-greybox.md) | Testbarkeit und Greyboxing | aktiv | Code- und Test-Agenten | architecture |

## Konventionen

- Entscheidungs-IDs: `D-xxx` ([Entscheidungsprotokoll](project/decision-log.md)). Offene Fragen: `Q-xxx` ([open-questions.md](open-questions.md)).
- Ein neuer Agent liest zuerst [agent-guide.md](agent-guide.md), nicht alle Dokumente.
- Der GitHub-Pages-Workflow veröffentlicht das gesamte Repository. Die Dokumente sind damit öffentlich einsehbar. Das bestehende Pages-Setup wurde nicht verändert.
