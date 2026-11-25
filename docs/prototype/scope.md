# Prototyp: Ziele und Umfang

**Zweck:** Definiert, was der erste Gameplay-Prototyp enthält und was ausdrücklich nicht.
**Zielgruppe:** Alle Agenten.
**Abhängigkeiten:** keine. Details je System in den Fachdokumenten.

## Ziel

Ein spielbarer erster Gameplay-Prototyp, der mit Greybox-Platzhaltern (einfachen geometrischen Formen) funktioniert (CONFIRMED: D-006, D-024). Er soll die Kernschleife prüfen: Gegner laufen auf den Zug zu, Spieler und Geschütz wehren sie ab, der Zug nimmt Schaden, der Spieler repariert.

Ob der Prototyp „Spaß macht“ oder „spannend“ ist, ist eine **menschliche Bewertungsaufgabe** des Projektverantwortlichen und wird nie von einem Agenten als erfüllt erklärt.

## Im Umfang (CONFIRMED)

- Top-Down-2D im Browser (D-001, D-002).
- Eine Lokomotive und ein einzelner Wagon (D-005).
- Greybox-Grafiken (D-006).
- Spielerbewegung mit WASD und Pfeiltasten (D-007).
- Automatischer Angriff des Spielers, automatisches Zuggeschütz (D-008, D-009).
- Gegner, die auf einer Seite spawnen, ein Zugziel wählen, Schaden verursachen und despawnen (D-013 bis D-015).
- Kontinuierliche Gegner mit variierender Intensität, größeren Gruppen, Pausen und einer größeren Angriffswelle (D-017, D-019).
- Bauen und Reparieren durch Nähe (D-020).
- Drei Schwierigkeitsgrade (D-021).
- Trennung von Gameplay, Darstellung und Szenen sowie separate Testmöglichkeiten (D-022 bis D-025).

## Nicht im Umfang (CONFIRMED bzw. aus Auftrag)

- Adventskalender, Türchen, 24 Tage (D-027).
- Überhitzung des Geschützes (D-010).
- Komplexe Bossmechaniken (D-019).
- Tod des Spielers (D-011).
- Finale Grafiken, Assets, Audio.
- Upgrade- und Progressionssysteme (Q-012, OPEN).

## Offen

Alle in [../open-questions.md](../open-questions.md) gelisteten Punkte, insbesondere Zahlenwerte, Gegnertypen, Ressourcen, Zuglebenspunkte, Sieg/Niederlage und Spielfeldmaße.

## Akzeptanz des Prototyps als Ganzes

Eine Gesamtabnahme ist OPEN, solange Sieg-/Niederlagebedingungen (Q-008) nicht entschieden sind. Bis dahin gilt: Prototyp = Menge der Einzelanforderungen (`REQ-…`) der Fachdokumente, jeweils mit eigenen Akzeptanzkriterien.
