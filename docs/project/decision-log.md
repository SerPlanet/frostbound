# Entscheidungsprotokoll

**Zweck:** Nachvollziehbare Liste aller bestätigten Entscheidungen und späterer Änderungen. Quelle der Wahrheit bei Widersprüchen.
**Zielgruppe:** Alle.
**Abhängigkeiten:** keine.

Nur CONFIRMED-Entscheidungen. Vorschläge und offene Fragen stehen in den Fachdokumenten bzw. in [open-questions.md](../open-questions.md). Einträge werden nie gelöscht. Änderungen erscheinen als neuer Eintrag mit Verweis, der alte Eintrag erhält „ersetzt durch D-xxx“.

Quelle der Erstbestätigungen: Projektauftrag „Documentation Foundation“ (2026-11-25).

| ID | Datum | Entscheidung (CONFIRMED) | Bereich | Vermerk |
|---|---|---|---|---|
| D-001 | 2026-11-25 | Zweidimensionales Spiel mit Top-Down-Perspektive. | Konzept | – |
| D-002 | 2026-11-25 | Das Spiel ist ein Browsergame. | Konzept | – |
| D-003 | 2026-11-25 | Langfristig ein Adventskalender-Spiel mit 24 Tagen. | Konzept | – |
| D-004 | 2026-11-25 | Der Zug steht im Mittelpunkt des Spiels und der Progression. | Konzept | – |
| D-005 | 2026-11-25 | Prototyp: eine Lokomotive und ein einzelner Wagon. | Prototyp | – |
| D-006 | 2026-11-25 | Prototyp mit Greybox-Grafiken (einfache geometrische Platzhalter) statt finaler Grafiken. | Prototyp | – |
| D-007 | 2026-11-25 | Spielerbewegung über WASD und Pfeiltasten. | Spieler | – |
| D-008 | 2026-11-25 | Der Spieler greift automatisch an. | Kampf | Verhältnis zum Zuggeschütz: OPEN (Q-013). |
| D-009 | 2026-11-25 | Ein automatisches Zuggeschütz sucht das nächste geeignete Ziel und schießt darauf. | Kampf | „Geeignet“, Reichweite: OPEN (Q-005). |
| D-010 | 2026-11-25 | Überhitzung wird im ersten Prototyp nicht implementiert. | Kampf | – |
| D-011 | 2026-11-25 | Der Spieler kann nicht sterben. | Spieler | – |
| D-012 | 2026-11-25 | Der Zug befindet sich an einer Seite des Spielbereichs. Die Spielfläche liegt ausschließlich auf einer Seite des Zuges. | Spielfeld | Maße, Position: OPEN (Q-011). |
| D-013 | 2026-11-25 | Gegner starten auf der dem Zug gegenüberliegenden Seite. Sie können außerhalb des sichtbaren Bereichs spawnen und laufen dann ins Spielfeld. Sie erscheinen nicht einfach mitten im sichtbaren Spielfeld. | Gegner | – |
| D-014 | 2026-11-25 | Gegner wählen unabhängig von der Spawnposition ein Zugziel. Die Wahl erfolgt bereits während der Bewegung. | Gegner | Zugziele, Wahlregel: OPEN (Q-014). |
| D-015 | 2026-11-25 | Erreicht ein Gegner sein Zugziel, verursacht er dort Schaden und despawnt anschließend. | Gegner | Schadenshöhe: OPEN (Q-004, Q-007). |
| D-016 | 2026-11-25 | Der Spieler muss nicht jeden Gegner selbst besiegen, bevor dieser den Zug erreicht. | Gegner | – |
| D-017 | 2026-11-25 | Gegner kommen kontinuierlich. Die Intensität variiert. Es gibt größere Gegnergruppen. Vor besonders großen Angriffen kann es kurze Pausen geben. | Angriffsverlauf | Zahlen: OPEN (Q-002, Q-003, Q-018). |
| D-018 | 2026-11-25 | Die Struktur ist lose von Plants vs. Zombies inspiriert. | Angriffsverlauf | Inspiration, keine Vorlage. |
| D-019 | 2026-11-25 | Der Prototyp enthält eine größere Angriffswelle, aber keine komplexen Bossmechaniken. | Angriffsverlauf | – |
| D-020 | 2026-11-25 | Bauen und Reparieren erfolgt durch Nähe, ohne zusätzliche Taste. Entfernt sich der Spieler, pausiert der Arbeitsfortschritt. | Bauen/Reparieren | Details: OPEN (Q-009, Q-010). |
| D-021 | 2026-11-25 | Drei Schwierigkeitsgrade: Gemütlich, Normal, Winterhart. Sie beeinflussen unter anderem die Gegneranzahl. | Schwierigkeit | Werte: OPEN (Q-001). |
| D-022 | 2026-11-25 | Gameplay und visuelle Darstellung sind sauber getrennt. | Architektur | – |
| D-023 | 2026-11-25 | Szenen werden nicht mit der eigentlichen Spiellogik vermischt. | Architektur | – |
| D-024 | 2026-11-25 | Gameplay muss mit Platzhaltergrafiken funktionieren. | Architektur | – |
| D-025 | 2026-11-25 | Es gibt separate Testmöglichkeiten für Gameplay, Visuals und die kombinierte Darstellung. | Architektur | Umsetzung: OPEN (Q-020). |
| D-026 | 2026-11-25 | Vorgesehene Technologie: Phaser 3 mit TypeScript und Vite. | Technik | Noch nicht installiert. |
| D-027 | 2026-11-25 | Der Adventskalender ist nicht Bestandteil des ersten Prototyps. | Umfang | – |
| D-028 | 2026-11-25 | Jede Designentscheidung hat den Status CONFIRMED, PROPOSED oder OPEN. Ideen gelten nicht automatisch als bestätigt. | Prozess | – |
| D-029 | 2026-11-25 | Verbindlicher Standard für Anforderungen (ID, Problemstellung, Ziel, Verhalten, Akzeptanzkriterien, Testfälle, Abhängigkeiten, Status), Testpflicht, Kennzeichnung subjektiver Kriterien als menschliche Bewertung und Definition of Done mit den Stufen „technisch abgeschlossen“, „erfolgreich getestet“, „inhaltlich akzeptiert“. | Prozess | Details: [process.md](process.md). Ergänzung zum Auftrag am 2026-11-25. |
