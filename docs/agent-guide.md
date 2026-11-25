# Agenten-Leitfaden

**Zweck:** Zeigt, welche Dokumente ein Agent für welche Aufgabe lesen muss. Kein Agent muss alle Dokumente lesen.
**Zielgruppe:** Alle Claude-Code-Agenten und deren Auftraggeber.
**Abhängigkeiten:** [README.md](README.md) (Statuslegende).

## Grundregeln für jeden Agenten

1. Lies immer [README.md](README.md) (Statuslegende) und das für die Aufgabe genannte Dokumentenset.
2. Setze nur **CONFIRMED** um. **PROPOSED** und **OPEN** werden nicht umgesetzt und nicht eigenmächtig entschieden. **TESTWERT** (vorläufiger Wert) und **TECH** (technische Entscheidung, D-060) dürfen wie dokumentiert umgesetzt und im Spieltest angepasst werden. Hängt eine Aufgabe von einem OPEN-Punkt ab, melde das dem Auftraggeber (mit Q-ID). Ein austauschbarer, klar markierter Platzhalter ist nur zulässig, wenn der Auftrag das ausdrücklich erlaubt.
3. Erfinde keine Spielmechaniken, Werte oder Gegnertypen.
4. Halte dich an den Umfang und den Nicht-Umfang in [prototype/scope.md](prototype/scope.md). Seit D-062 gehört der erweiterte Gesamtprototyp zum Umfang, die Regeln seiner neuen Funktionen sind aber OPEN, bis sie entschieden sind.
5. Bei Widersprüchen zwischen Dokumenten gilt das [Entscheidungsprotokoll](project/decision-log.md). Melde den Widerspruch.
6. Ändere Dokumente nur, wenn der Auftrag das vorsieht, und halte dich an [project/process.md](project/process.md).
7. Technische Details, die nicht festgelegt sind, entscheidet der Implementierungs-Agent pragmatisch und dokumentiert sie als TECH (D-060). Dabei ändert er keine bestätigte Gameplay-Regel. Keine zusätzlichen Pakete, Testframeworks, Seed-Systeme oder Dashboards.
8. Vor Abschluss: Prüfe sämtliche Akzeptanzkriterien der betroffenen `REQ-…`-Anforderungen, führe die Testfälle aus (automatisiert, sonst manuell beschrieben) und liste nicht erfüllte Kriterien im Abschlussbericht. Subjektive Kriterien (Spielspaß, Spannung, visuelle Qualität) sind menschliche Bewertungsaufgaben und werden nie von dir als erfüllt erklärt.
9. Berichte getrennt: „technisch abgeschlossen“ (Definition of Done), „erfolgreich getestet“ (Tests bestanden, mit Nachweis). „Inhaltlich akzeptiert“ kann nur der Projektverantwortliche feststellen. Siehe [project/process.md](project/process.md), Abschnitt „Definition of Done“.
10. Git: Neue Funktionen des erweiterten Gesamtprototyps entstehen auf `feature/<name>` und kommen nur nach ausdrücklicher Freigabe des Projektverantwortlichen in `main` (D-063, siehe [project/process.md](project/process.md)). Der Agent erklärt nie selbst, dass eine Funktion akzeptiert ist. Größere Architekturänderungen und Änderungen an CONFIRMED-Spielregeln nur nach vorheriger Freigabe. Die Live-Einstellung von GitHub Pages ändert ein Agent nur mit ausdrücklicher Zustimmung. Zugangsdaten gehören nie ins Repository.

## Aufgabe → zu lesende Dokumente

| Aufgabe | Pflichtlektüre | Optional |
|---|---|---|
| Projekt verstehen / Einstieg | project/overview, prototype/scope | open-questions |
| Spielfeld, Spielablauf, Angriffsverlauf | prototype/core-gameplay, prototype/scope | prototype/enemies |
| Spielerbewegung, Bauen/Reparieren durch Nähe | prototype/player, technical/architecture | prototype/core-gameplay |
| Gegnerverhalten, Spawning, Bewegung, Zielwahl | prototype/enemies, technical/architecture | prototype/difficulty, prototype/train-and-defense |
| Automatische Angriffe, Zuggeschütz, Treffer, Besiegen | prototype/combat, technical/architecture | prototype/player, prototype/enemies |
| Zug, Lebenspunkte, Schaden | prototype/train-and-defense, technical/architecture | prototype/repair-system, prototype/win-lose |
| Reparatur, Reparaturbereiche, Prioritäten | prototype/repair-system, prototype/train-and-defense | prototype/player, technical/architecture |
| Ressourcen (Prototyp: keine Progression) | prototype/resources | prototype/repair-system |
| Schwierigkeitsgrade | prototype/difficulty | prototype/enemies |
| Sieg/Niederlage, Rundenende | prototype/win-lose | prototype/train-and-defense |
| Startbildschirm, Schwierigkeitswahl, HUD, Ergebnisbildschirm | prototype/ui-and-flow, prototype/win-lose | prototype/difficulty, technical/architecture |
| Balance-Modell, Statistik am Rundenende | prototype/balance-and-statistics | prototype/combat, prototype/enemies, prototype/difficulty |
| Begriffe klären | project/glossary | – |
| Prototyp implementieren (Schritt für Schritt) | technical/implementation-plan, technical/architecture | das jeweilige Fachdokument des Schritts |
| Code-Architektur, Projektstruktur, Konfiguration | technical/architecture, technical/testing-and-greybox | prototype/scope |
| Greybox-Darstellung, Tests, Testszenen | technical/testing-and-greybox, technical/architecture | das jeweilige Gameplay-Dokument |
| Branches, Testversionen (Preview), Veröffentlichung, CI | technical/deployment-and-previews, project/process | technical/testing-and-greybox, technical/architecture |
| Dokumentation pflegen, Entscheidung eintragen | project/process, project/decision-log | open-questions |
| Offene Fragen klären | open-questions | betroffenes Fachdokument |
| Adventskalender / Langzeitplanung | project/overview (Abschnitt Langzeitvision) | open-questions |

## Hinweis zu Querverweisen

Fachdokumente enthalten die für sie nötigen bestätigten Fakten selbst, auch wenn diese in anderen Dokumenten ebenfalls stehen. Quelle der Wahrheit für Entscheidungen ist das Entscheidungsprotokoll. Weichen Dokumente voneinander ab, ist das ein Fehler und zu melden.
