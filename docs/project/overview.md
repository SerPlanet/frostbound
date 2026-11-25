# Projektüberblick

**Zweck:** Erklärt Vision, Kontext und Langzeitplanung von FROSTBOUND und grenzt den Prototyp davon ab.
**Zielgruppe:** Alle.
**Abhängigkeiten:** keine.

## Projekt

**FROSTBOUND – The Last Train** ist ein 2D-Browsergame mit Top-Down-Perspektive. Der Zug steht im Mittelpunkt des Spiels und der Progression. (CONFIRMED: D-001, D-002, D-004)

Repository: https://github.com/SerPlanet/frostbound. GitHub Pages ist eingerichtet (Startseite `index.html`, Deployment über `.github/workflows/pages.yml`).

## Aktuelle Phase

Der erste Gameplay-Prototyp ist umgesetzt (Greybox, Phaser 3, TypeScript, Vite) und wurde in mehreren Balance-Teststand-Runden getestet. Seit D-062 ist der **erweiterte Gesamtprototyp** das Entwicklungsziel: zusätzlich visuelle Gestaltung, Wiederaufbau zerstörter Zugteile, Adventstüren und Tageswechsel, Belohnungen und Upgrades, neue Waggons und Geschützplatzierung sowie ein Mini-Durchlauf über mehrere Tage. Das vollständige 24-Tage-Spiel wird erst danach geplant. Aktuell: Stufe 0 (Infrastruktur). Umfang und Stufen: [prototype/scope.md](../prototype/scope.md). Entwicklungsstruktur: [process.md](process.md).

## Technologie

Phaser 3 mit TypeScript und Vite ist als Technologie bestätigt (CONFIRMED: D-026, D-049) und im Projekt eingerichtet. Veröffentlichung über GitHub Pages, Testversionen siehe [technical/deployment-and-previews.md](../technical/deployment-and-previews.md).

## Langzeitvision: Adventskalender (nicht Teil des Prototyps)

Dieser Abschnitt beschreibt die langfristige Vision. Der Adventskalender war **nicht** Bestandteil des ersten Gameplay-Prototyps (CONFIRMED: D-027). Einzelne Ansätze (Adventstür, Tageswechsel) gehören seit D-062 zum erweiterten Gesamtprototyp, ihre Regeln sind OPEN (Q-016).

- Langfristig ist FROSTBOUND ein Adventskalender-Spiel mit 24 Tagen (CONFIRMED: D-003).
- Bisherige Ideen, noch nicht bestätigt (PROPOSED):
  - 24 einzelne Tage.
  - Jeder Tag beginnt mit dem Öffnen eines Adventskalendertürchens.
  - Hinter den Türchen können neue Inhalte, Geschütze, Upgrades, Auswahlmöglichkeiten oder Gegenstände liegen.
  - Die Türchen beeinflussen den langfristigen Spielfortschritt.
- OPEN: Genaue Verteilung und Funktionsweise der Türchen (Q-016).

Konsequenz: Der erste Gameplay-Prototyp enthält keine Kalenderlogik, kein Türchen-UI und keine tagesbasierten Inhalte. Im erweiterten Gesamtprototyp (D-062) werden Adventstüren und Tageswechsel als einzelne Funktionen entwickelt und getestet, sobald ihre Regeln entschieden sind. Das vollständige 24-Tage-Spiel folgt erst nach der Akzeptanz des erweiterten Gesamtprototyps.

## Langzeitvision: Ressourcen und Progression (nicht Teil des Prototyps)

Langzeitplanung. Der erste Gameplay-Prototyp enthielt keine dieser Mechaniken (CONFIRMED: D-046). Einzelne Ausschnitte (Belohnungen, Upgrades) gehören seit D-062 zum erweiterten Gesamtprototyp, ihre Regeln sind OPEN (Q-006, Q-012).

- CONFIRMED: Das Vollspiel soll später drei Ressourcen besitzen.
- OPEN: Die endgültigen drei Ressourcen und ihre Verwendung. Genannte Kandidaten: Kohle, Essen, Geld, Eisen (Q-006).
- CONFIRMED als Grundidee (Ausgestaltung OPEN): Ressourcen durch Gegnerdrops, Fundstücke und Wellenabschlussbelohnungen. Türchenbelohnungen zu Beginn eines Tages. Kostenlose Freischaltung neuer Waffen, Upgrades oder Fähigkeiten. Teilweise Auswahl zwischen zwei Belohnungen. Begrenzte Ressourcen erzwingen Entscheidungen, welche Wagons und Waffen verbessert werden.
- OPEN: Upgrade- und Progressionssysteme (Q-012), Türchen (Q-016).
- Ausnahme im Prototyp: Reparaturen sind kostenlos (D-043).
