# Projektüberblick

**Zweck:** Erklärt Vision, Kontext und Langzeitplanung von FROSTBOUND und grenzt den Prototyp davon ab.
**Zielgruppe:** Alle.
**Abhängigkeiten:** keine.

## Projekt

**FROSTBOUND – The Last Train** ist ein 2D-Browsergame mit Top-Down-Perspektive. Der Zug steht im Mittelpunkt des Spiels und der Progression. (CONFIRMED: D-001, D-002, D-004)

Repository: https://github.com/SerPlanet/frostbound. GitHub Pages ist eingerichtet (Startseite `index.html`, Deployment über `.github/workflows/pages.yml`).

## Aktuelle Phase

Planungsphase für einen ersten Gameplay-Prototyp. Es gibt noch keinen Spielcode, keine Code-Projektstruktur und keine Assets. Umfang des Prototyps: [prototype/scope.md](../prototype/scope.md).

## Technologie

Phaser 3 mit TypeScript und Vite ist als Technologie bestätigt (CONFIRMED: D-026, D-049). Sie ist noch nicht installiert, die Einrichtung folgt erst nach der Dokumentationsphase (D-032).

## Langzeitvision: Adventskalender (nicht Teil des Prototyps)

Dieser Abschnitt beschreibt ausschließlich die langfristige Vision. Der Adventskalender ist **nicht** Bestandteil des ersten Prototyps (CONFIRMED: D-027).

- Langfristig ist FROSTBOUND ein Adventskalender-Spiel mit 24 Tagen (CONFIRMED: D-003).
- Bisherige Ideen, noch nicht bestätigt (PROPOSED):
  - 24 einzelne Tage.
  - Jeder Tag beginnt mit dem Öffnen eines Adventskalendertürchens.
  - Hinter den Türchen können neue Inhalte, Geschütze, Upgrades, Auswahlmöglichkeiten oder Gegenstände liegen.
  - Die Türchen beeinflussen den langfristigen Spielfortschritt.
- OPEN: Genaue Verteilung und Funktionsweise der Türchen (Q-016).

Konsequenz für den Prototyp: keine Kalenderlogik, kein Türchen-UI, keine tagesbasierten Inhalte.

## Langzeitvision: Ressourcen und Progression (nicht Teil des Prototyps)

Nur Langzeitplanung. Der Prototyp enthält keine dieser Mechaniken (CONFIRMED: D-046).

- CONFIRMED: Das Vollspiel soll später drei Ressourcen besitzen.
- OPEN: Die endgültigen drei Ressourcen und ihre Verwendung. Genannte Kandidaten: Kohle, Essen, Geld, Eisen (Q-006).
- CONFIRMED als Grundidee (Ausgestaltung OPEN): Ressourcen durch Gegnerdrops, Fundstücke und Wellenabschlussbelohnungen. Türchenbelohnungen zu Beginn eines Tages. Kostenlose Freischaltung neuer Waffen, Upgrades oder Fähigkeiten. Teilweise Auswahl zwischen zwei Belohnungen. Begrenzte Ressourcen erzwingen Entscheidungen, welche Wagons und Waffen verbessert werden.
- OPEN: Upgrade- und Progressionssysteme (Q-012), Türchen (Q-016).
- Ausnahme im Prototyp: Reparaturen sind kostenlos (D-043).
