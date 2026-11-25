# Prototyp: Ziele und Umfang

**Zweck:** Definiert, was der erste Gameplay-Prototyp enthält, was ausdrücklich nicht, und was nicht entschieden ist.
**Zielgruppe:** Alle Agenten.
**Abhängigkeiten:** keine. Details je System in den Fachdokumenten.

## Ziel

Ein spielbarer erster Gameplay-Prototyp, der mit Greybox-Platzhaltern (einfachen geometrischen Formen) funktioniert (CONFIRMED: D-006, D-024). Er prüft die Kernschleife: Gegner laufen von oben auf den Zug zu, Spieler und Zuggeschütz wehren sie ab, der Spieler repariert den Zug. Die Prototyp-Entwicklung folgt dem bestätigten Prozess (D-032).

Ob der Prototyp „Spaß macht“ oder „spannend“ ist, ist eine **menschliche Bewertungsaufgabe** des Projektverantwortlichen und wird nie von einem Agenten als erfüllt erklärt.

## Im Umfang (CONFIRMED)

- Top-Down-2D im Browser (D-001, D-002).
- Zug am unteren Rand, still während der Runde, Spielbereich darüber (D-034). Eine Lokomotive und ein einzelner Wagon (D-005).
- Greybox-Grafiken (D-006).
- Spielerbewegung mit WASD und Pfeiltasten, freie Bewegung durch Gegner (D-007, D-035).
- Zwei unabhängige automatische Angriffsquellen: Spieler (stark begrenzte Reichweite, Single Target) und Zuggeschütz (gesamtes Spielfeld) (D-030, D-036, D-037).
- Genau ein Gegnertyp, zombieartige Bewegung, zufällige Zielwahl zwischen Lokomotive und Wagon, Schaden und Despawn (D-038 bis D-040, D-015).
- Lebenspunkte je Zugteil, Funktionsverlust zerstörter Wagons (D-041).
- Kostenloses Reparatursystem mit Reparaturbereichen und Prioritäten (D-043).
- Sieg und Niederlage (D-042, D-044).
- Gegnerverlauf: Gesamtzahl je Schwierigkeitsgrad, wachsende Intensität, größere Gruppen, Pausen, eine größere Angriffswelle (D-017, D-019, D-031, D-045).
- Drei Schwierigkeitsgrade (D-021).
- Einfacher Spielablauf mit Startbildschirm, Schwierigkeitswahl, HUD und Ergebnisbildschirm (D-047).
- Rundenstatistik und einfaches Balance-Modell (D-048).
- Trennung von Gameplay, Darstellung und Szenen sowie separate Testmöglichkeiten (D-022 bis D-025).

## Optional (CONFIRMED als optional, niedrige Priorität)

- Gegnerdrops und Einsammeln dürfen umgesetzt werden, dürfen den Kernprototyp aber nicht verzögern (D-046). Ob es sie gibt: OPEN (Q-006).

## Nicht im Umfang (CONFIRMED)

- Progressionsmechaniken: Ressourcen als Spielsystem, Belohnungen, Freischaltungen, Upgrades (D-046).
- Adventskalender, Türchen, 24 Tage (D-027).
- Überhitzung des Geschützes (D-010).
- Komplexe Bossmechaniken (D-019).
- Tod des Spielers (D-011).
- Mehrere Gegnertypen (D-038).
- Flächenangriffe und Angriffe auf mehrere Ziele: sind spätere Möglichkeiten (D-036).
- Besondere Zusatzfunktion oder Waffen der Lokomotive: spätere Möglichkeit (D-041).
- Komplexe Menüs und Progressionsbildschirme (D-047).
- Eine Live-Entwickleransicht ist keine Priorität und nicht Teil des erforderlichen Umfangs (D-048).
- Finale Grafiken: Der Prototyp verwendet Greybox (D-006).

## Nicht festgelegt (weder im noch außerhalb des Umfangs)

- Audio (Q-032).
- Upgrade- und Progressionssysteme des Vollspiels (Q-012). Die Frage bleibt offen. Die Progressionsmechaniken sind lediglich nicht Teil des Prototyps.
- Bauen: Es ist durch Nähe bestätigt (D-020), aber was gebaut werden kann, ist OPEN (Q-010).

## Prototyp und Vollspiel

Langzeitinhalte (Adventskalender, drei Ressourcen, Upgrades) stehen in [../project/overview.md](../project/overview.md) und im Abschnitt „Vollspiel“ von [resources.md](resources.md). Sie sind nicht Teil dieser Spezifikation und erzeugen keine Prototyp-Anforderungen.

## Nicht Grundlage des Erfolgs

Eine feste Spieldauer ist ausdrücklich nicht die Grundlage für den Erfolg des Prototyps. Der Verlauf beruht auf der festgelegten Gegnergesamtzahl (je Schwierigkeitsgrad variabel), Spawnverteilung, Intensität, Gruppen und Pausen (CONFIRMED: D-031).

## Offen

Alle in [../open-questions.md](../open-questions.md) gelisteten Punkte, insbesondere Zahlenwerte (Tuning), Geschütze (Q-025), Reparaturbereiche (Q-026) und Spielfeldmaße (Q-011).

## Akzeptanz des Prototyps als Ganzes

Der Prototyp gilt als technisch abgeschlossen, wenn alle `REQ-…`-Anforderungen seiner Fachdokumente die Definition of Done erfüllen ([../project/process.md](../project/process.md)). Die inhaltliche Abnahme erfolgt durch den Projektverantwortlichen im Feedbackprozess (D-032).
