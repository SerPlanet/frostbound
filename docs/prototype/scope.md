# Prototyp: Ziele und Umfang

**Zweck:** Definiert, was der erste Gameplay-Prototyp enthält, was ausdrücklich nicht, und was nicht entschieden ist.
**Zielgruppe:** Alle Agenten.
**Abhängigkeiten:** keine. Details je System in den Fachdokumenten.

## Ziel

**Erweiterung (CONFIRMED: D-062):** Entwicklungsziel ist inzwischen der erweiterte Gesamtprototyp, siehe Abschnitt „Erweiterter Gesamtprototyp“ unten. Dieses Dokument beschreibt zunächst den ersten Gameplay-Prototyp (Stufe 1 der Entwicklung, Schritte 1 bis 9 des Implementierungsplans, umgesetzt und in Balance-Teststände 1 bis 6 weiterentwickelt).

Ein schnell spielbarer Gameplay-Prototyp, der ausschließlich dazu dient, die grundlegenden Spielmechaniken auszuprobieren und vom Nutzer beurteilen zu lassen. Er ist kein fertiges Spiel und kein verkleinertes Abbild der Vollversion (CONFIRMED: D-059, D-032). Er verwendet Greybox-Platzhalter (D-006, D-024, D-058).

Ob der Prototyp „Spaß macht“ oder „spannend“ ist, ist eine **menschliche Bewertungsaufgabe** des Projektverantwortlichen und wird nie von einem Agenten als erfüllt erklärt.

## Im Umfang (CONFIRMED)

- Top-Down-2D im Browser, festes Seitenverhältnis 16:9, proportionale Skalierung, auflösungsunabhängige Spiellogik (D-001, D-002, D-058).
- Der Zug: Lokomotive, ein Wagon, ein Geschütz auf dem Wagon. Er steht still am unteren Rand, der Spielbereich liegt darüber (D-034, D-054).
- Lebenspunkte: Lokomotive 100, Wagon 100, Geschütz 20 (Startwerte, D-053).
- Spieler: WASD und Pfeiltasten, feste Geschwindigkeit, diagonal gleich schnell, unsterblich, läuft frei durch Gegner, bleibt im Spielfeld und außerhalb des Zuges (D-007, D-011, D-035, D-057).
- Zwei unabhängige automatische Angriffsquellen: Spieler (stark begrenzte Reichweite, Einzelziel) und Zuggeschütz (gesamtes Spielfeld) (D-030, D-036, D-037).
- Genau ein Gegnertyp, zombieartige Bewegung, zufällige Zielwahl unter den intakten Zugteilen mit Neuwahl, 10 Schaden, dann Verschwinden (D-038, D-040, D-051, D-052).
- Wagon-Geschütz-Abhängigkeit (D-055).
- Kostenlose Reparatur in 5-HP-Schritten alle 5 Sekunden mit Reparaturzonen (D-056).
- Sieg und Niederlage (D-050).
- Gegnerverlauf: Gesamtzahl je Schwierigkeitsgrad, wachsende Intensität, Gruppen, Pausen, eine größere Welle (D-017, D-019, D-031, D-045).
- Drei Schwierigkeitsgrade (D-021).
- Startbildschirm mit Schwierigkeitswahl, HUD, Ergebnisbildschirm mit Statistik, Rückkehr zum Start (D-047, D-048).
- Trennung von Gameplay, Darstellung und Szenen sowie separate Testmöglichkeiten (D-022 bis D-025).

## Optional (CONFIRMED als optional, niedrige Priorität)

- Gegnerdrops und Einsammeln, falls sie den Kernprototyp nicht verzögern (D-046). Im Implementierungsplan nicht enthalten.

## Erweiterter Gesamtprototyp (CONFIRMED: D-062)

Der erweiterte Gesamtprototyp enthält zusätzlich zum Gameplay-Prototyp folgende Bereiche. **Das ist nur eine Umfangsaussage.** Die Regeln der einzelnen Funktionen sind nicht festgelegt und gelten als **OPEN**, bis der Projektverantwortliche sie entscheidet und als eigene Entscheidung im [Entscheidungsprotokoll](../project/decision-log.md) steht.

- Visuelle Gestaltung und tatsächliche Spieloptik (Zug, Geschütze, Gegner, Umgebung, Spielerfigur, HUD, Reparaturzonen, Start- und Ergebnisbildschirm, Menüs, Interaktionsanzeigen). Die Greybox bleibt als technischer Vergleichsmodus erhalten.
- Wiederaufbau zerstörter Zugteile.
- Adventstüren und Tageswechsel.
- Belohnungen und Upgrades.
- Neue Waggons und Geschützplatzierung.
- Einzelne spielbare Testmodi für neue Funktionen.
- Ein zusammenhängender Mini-Durchlauf mit mehreren Tagen.

Das vollständige 24-Tage-Spiel wird erst nach Abschluss und Akzeptanz des erweiterten Gesamtprototyps geplant (D-032 Schritt 6). Bisher bestätigte Regeln bleiben bestehen, sofern sie nicht ausdrücklich geändert werden.

Vorgesehene Stufen (CONFIRMED als Plan, D-062; Inhalte und Reihenfolge von Stufe 3 sind OPEN):

| Stufe | Inhalt |
|---|---|
| 0 | Entscheidung D-062, Branch- und Testversions-Infrastruktur, Dokumentation |
| 1 | Wiederaufbau zerstörter Zugteile (OPEN: Regeln, Q-033) |
| 2 | Visuelles Konzept und Umsetzung (OPEN: Grafikquelle und Stil, Q-034) |
| 3 | Zusatzfunktionen, jeweils eigener Branch und Testmodus: Tageswechsel, Adventstür, Belohnungen, Upgrades, Waggons, Geschütze (OPEN: Q-012, Q-016, Q-025, Q-035) |

Entwicklungsstruktur und Freigabe: [../project/process.md](../project/process.md). Testversionen: [../technical/deployment-and-previews.md](../technical/deployment-and-previews.md).

## Nicht im Umfang (CONFIRMED, D-059)

Hinweis (D-062): Diese Liste gilt für den **ersten Gameplay-Prototyp**. Soweit ein Punkt zum erweiterten Gesamtprototyp gehört (siehe oben: finale Grafik und Menüs, Belohnungen, Upgrades, zusätzliche Waggons und Geschütze, Adventskalender-Ansätze), ist er dafür nicht mehr ausgeschlossen. Seine Regeln bleiben OPEN, bis sie entschieden sind. Alle übrigen Punkte bleiben ausgeschlossen.

- 24-Tage-Adventskalender (D-027).
- Progression, Ressourcenwirtschaft, Upgrades, Belohnungssysteme.
- Zusätzliche Waggons, zusätzliche Geschütze, Geschütz auf der Lokomotive.
- Geschützangriffe durch spezielle Gegner (das Geschütz kann im Prototyp nicht direkt angegriffen werden).
- Spätere besondere Gegnertypen, mehrere Gegnertypen, komplexe Bossmechaniken.
- Vollständige Story, spätere Zug- und Lokomotiv-Upgrades.
- Separate Geschützreparatur (D-055).
- Überhitzung des Geschützes (D-010).
- Tod des Spielers, Spieler-Lebenspunkte (D-011, D-057).
- Flächenangriffe und Mehrfachziele (D-036).
- Komplexe Menüs, Progressionsbildschirme (D-047). Live-Entwickleransicht (D-048).
- Finale Grafiken (D-006).

Die Architektur darf Erweiterungen nicht unmöglich machen, bereitet sie aber nicht vor (D-059, D-060).

## Nicht festgelegt

- Audio ist weder bestätigt noch ausgeschlossen (Q-032). Es ist nicht im Implementierungsplan.
- Bauen: durch Nähe bestätigt (D-020). Es gibt im Prototyp nichts zu bauen, siehe Q-010 (zur Bestätigung).
- Upgrade- und Progressionssysteme des Vollspiels (Q-012) sind offen. Sie waren nicht Teil des ersten Gameplay-Prototyps. Einzelne Ausschnitte gehören seit D-062 zum erweiterten Gesamtprototyp, ihre Regeln sind OPEN.

## Prototyp und Vollspiel

Langzeitinhalte stehen nur in [../project/overview.md](../project/overview.md) und im Abschnitt „Vollspiel“ von [resources.md](resources.md). Sie erzeugen keine Anforderungen an den ersten Gameplay-Prototyp. Für den erweiterten Gesamtprototyp (D-062) entstehen Anforderungen erst mit der jeweiligen Funktionsentscheidung.

## Erfolg

Der Prototyp ist technisch abgeschlossen, wenn alle `REQ-…`-Anforderungen seiner Fachdokumente die Definition of Done erfüllen ([../project/process.md](../project/process.md)). Eine feste Spieldauer ist nicht die Grundlage des Erfolgs (D-031). Die inhaltliche Abnahme erfolgt durch den Projektverantwortlichen im Feedbackprozess (D-032).

## Offen

Siehe [../open-questions.md](../open-questions.md). Es verbleiben Testwerte und wenige nicht blockierende Fragen.
