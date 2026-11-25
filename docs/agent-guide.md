# Agenten-Leitfaden

**Zweck:** Zeigt, welche Dokumente ein Agent für welche Aufgabe lesen muss. Kein Agent muss alle Dokumente lesen.
**Zielgruppe:** Alle Claude-Code-Agenten und deren Auftraggeber.

## Grundregeln für jeden Agenten

1. Lies immer [README.md](README.md) (Statuslegende) und das für die Aufgabe genannte Dokumentenset.
2. Setze nur **CONFIRMED** um. **PROPOSED** und **OPEN** werden nicht umgesetzt und nicht eigenmächtig entschieden. Hängt eine Aufgabe von einem OPEN-Punkt ab, melde das dem Auftraggeber (mit Q-ID). Ein austauschbarer, klar markierter Platzhalter ist nur zulässig, wenn der Auftrag das ausdrücklich erlaubt.
3. Erfinde keine Spielmechaniken, Werte oder Gegnertypen.
4. Halte dich an den Nicht-Umfang in [prototype/scope.md](prototype/scope.md).
5. Bei Widersprüchen zwischen Dokumenten gilt das [Entscheidungsprotokoll](project/decision-log.md). Melde den Widerspruch.
6. Ändere Dokumente nur, wenn der Auftrag das vorsieht, und halte dich an [project/process.md](project/process.md).

7. Vor Abschluss: Prüfe sämtliche Akzeptanzkriterien der betroffenen `REQ-…`-Anforderungen, führe die Testfälle aus (automatisiert, sonst manuell beschrieben) und liste nicht erfüllte Kriterien im Abschlussbericht. Subjektive Kriterien (Spielspaß, Spannung, visuelle Qualität) sind menschliche Bewertungsaufgaben und werden nie von dir als erfüllt erklärt.
8. Berichte getrennt: „technisch abgeschlossen“ (Definition of Done), „erfolgreich getestet“ (Tests bestanden, mit Nachweis). „Inhaltlich akzeptiert“ kann nur der Projektverantwortliche feststellen. Siehe [project/process.md](project/process.md), Abschnitt „Definition of Done“.

## Aufgabe → zu lesende Dokumente

| Aufgabe | Pflichtlektüre | Optional |
|---|---|---|
| Projekt verstehen / Einstieg | project/overview, prototype/scope | open-questions |
| Spielfeld, Spielablauf, Angriffsverlauf | prototype/core-gameplay, prototype/scope | prototype/enemies |
| Spielerbewegung, Bauen/Reparieren durch Nähe | prototype/player, technical/architecture | prototype/core-gameplay |
| Gegnerverhalten, Spawning, Zielwahl | prototype/enemies, technical/architecture | prototype/difficulty |
| Automatische Angriffe, Zuggeschütz | prototype/combat, technical/architecture | prototype/player, prototype/enemies |
| Zug, Schaden, Reparatur | prototype/train-and-defense, technical/architecture | prototype/resources, prototype/win-lose |
| Ressourcen | prototype/resources | prototype/train-and-defense |
| Schwierigkeitsgrade | prototype/difficulty | prototype/enemies |
| Sieg/Niederlage, Rundenende | prototype/win-lose | prototype/train-and-defense |
| Code-Architektur, Projektstruktur (später) | technical/architecture, technical/testing-and-greybox | prototype/scope |
| Greybox-Darstellung, Tests, Testszenen | technical/testing-and-greybox, technical/architecture | das jeweilige Gameplay-Dokument |
| Dokumentation pflegen, Entscheidung eintragen | project/process, project/decision-log | open-questions |
| Offene Fragen klären | open-questions | betroffenes Fachdokument |
| Adventskalender / Langzeitplanung | project/overview (Abschnitt Langzeitvision) | open-questions |

## Hinweis zu Querverweisen

Fachdokumente enthalten die für sie nötigen bestätigten Fakten selbst, auch wenn diese in anderen Dokumenten ebenfalls stehen. Quelle der Wahrheit für Entscheidungen ist das Entscheidungsprotokoll. Weichen Dokumente voneinander ab, ist das ein Fehler und zu melden.
