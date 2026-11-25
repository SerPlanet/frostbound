# Entwicklungsprozess und Dokumentationsregeln

**Zweck:** Legt fest, wie dokumentiert wird und wie Agenten arbeiten sollen.
**Zielgruppe:** Alle, besonders Agenten, die Dokumente ändern.
**Abhängigkeiten:** keine.

## Dokumentationsregeln

Der Statuswortschatz CONFIRMED, PROPOSED, OPEN gilt für alle Designentscheidungen (CONFIRMED: D-028). Ergänzend gibt es TESTWERT (vorläufiger Zahlenwert, D-045) und TECH (technische Entscheidung des Agenten im Rahmen von D-060). Beide ändern keine bestätigte Gameplay-Regel.

1. Eine Idee wird nicht bestätigt, nur weil sie in einem Gespräch erwähnt wurde. Bestätigt ist nur, was der Projektverantwortliche ausdrücklich bestätigt.
2. Jedes Dokument hat einen eindeutigen Zweck, nennt Zielgruppe und Abhängigkeiten und ist eigenständig lesbar.
3. Bestätigtes, Vorgeschlagenes und Offenes sind sichtbar getrennt und mit Status markiert.
4. Neue bestätigte Entscheidung: Eintrag im [Entscheidungsprotokoll](decision-log.md) mit neuer D-ID, dann das betroffene Fachdokument anpassen. Ändert sich eine Entscheidung, wird der alte Eintrag nicht gelöscht, sondern als „ersetzt durch D-xxx“ markiert.
5. Neue offene Frage: Eintrag in [open-questions.md](../open-questions.md) mit Q-ID und im betroffenen Fachdokument als OPEN. Wird sie entschieden, wird der Q-Eintrag auf „entschieden“ gesetzt und auf die D-ID verwiesen.
6. Keine Widersprüche zwischen Dokumenten. Bei Zweifel gilt das Entscheidungsprotokoll.
7. Zahlenwerte nur, wenn CONFIRMED. Sonst als OPEN führen.
8. Prototyp und Vollspiel bleiben getrennt (D-062: der erweiterte Gesamtprototyp enthält einzelne Funktionen davon, deren Regeln OPEN sind, bis sie entschieden und eingetragen sind): Vollspielinhalte (Adventskalender, drei Ressourcen, Upgrades, Progression) stehen nur in [overview.md](overview.md) und im Abschnitt „Vollspiel“ von [resources.md](../prototype/resources.md) und erzeugen keine Prototyp-Anforderungen.
9. Möglichst wenige Dokumente. Neue Dokumente nur bei klar eigenständigem Zweck, und sie werden in [README.md](../README.md) und [agent-guide.md](../agent-guide.md) eingetragen.

## Standard für Anforderungen und Erfolgskriterien (CONFIRMED: D-029)

Jede funktionale Anforderung hat eine ID (`REQ-<Bereich>-<Nr>`) und diese Struktur:

- **ID**
- **Problemstellung** – welches überprüfbare Problem wird gelöst
- **Ziel**
- **Gewünschtes Verhalten**
- **Akzeptanzkriterien** – möglichst objektiv überprüfbar
- **Testfälle** – automatisiert, sonst nachvollziehbarer manueller Test; Testart: `auto` / `manuell` / `menschl. Bewertung`
- **Abhängigkeiten**
- **Entscheidungsstatus** – CONFIRMED / PROPOSED / OPEN

Verbindliche Regeln:

1. Anforderungen sind so konkret, dass ein Agent ohne zusätzliche Interpretation weiß, was umzusetzen ist.
2. Akzeptanzkriterien sind möglichst objektiv überprüfbar. Wo ein Wert OPEN ist, formuliert das Kriterium die Eigenschaft relativ oder parametrisiert („konfigurierter Wert“), nie mit einer erfundenen Zahl.
3. Jeder Agent prüft vor Abschluss, ob sämtliche Akzeptanzkriterien erfüllt sind.
4. Für überprüfbare Anforderungen werden passende automatisierte Tests erstellt oder vorhandene ausgeführt.
5. Ist etwas nicht automatisiert testbar, wird ein nachvollziehbarer manueller Test beschrieben.
6. Nicht erfüllte Kriterien stehen ausdrücklich im Abschlussbericht.
7. Fehlende Designentscheidungen werden nicht eigenmächtig getroffen.
8. Subjektive Kriterien (Spielspaß, Spannung, visuelle Qualität) sind als **menschliche Bewertungsaufgabe** gekennzeichnet und werden nie von einem Agenten als „erfüllt“ erklärt.

### Definition of Done

Eine Aufgabe ist erst **technisch abgeschlossen**, wenn:

- alle vereinbarten Anforderungen umgesetzt sind,
- alle relevanten Akzeptanzkriterien erfüllt sind,
- die vorgesehenen Tests erfolgreich sind,
- keine bekannten kritischen Fehler offen sind,
- die Dokumentation aktualisiert wurde,
- der Abschlussbericht die Ergebnisse nachvollziehbar darstellt.

Drei Stufen sind getrennt zu benennen und nicht gleichzusetzen:

| Stufe | Bedeutung | Wer stellt fest |
|---|---|---|
| Technisch abgeschlossen | Alle Punkte der Definition of Done erfüllt | Agent |
| Erfolgreich getestet | Alle vorgesehenen automatisierten und manuellen Tests bestanden | Agent bzw. Tester, mit Nachweis |
| Inhaltlich akzeptiert | Projektverantwortlicher hat Ergebnis ausdrücklich abgenommen | nur Projektverantwortlicher |

Ein Agent berichtet höchstens „technisch abgeschlossen“ und „erfolgreich getestet“. „Inhaltlich akzeptiert“ erklärt er nie selbst.

## Entwicklungsprozess (CONFIRMED: D-032)

Die folgende Reihenfolge ist verbindlich:

1. GitHub-Repository einrichten. (erledigt)
2. Dokumentation erstellen und vervollständigen. (erledigt)
3. Prototyp auf Grundlage der Dokumentation entwickeln. (aktuell: erweiterter Gesamtprototyp, D-062)
4. Nutzerfeedback einholen.
5. Prototyp anhand des Feedbacks verbessern. Die Schritte 4 und 5 werden wiederholt, bis der Projektverantwortliche zufrieden ist.
6. Vollständiges Spiel durchplanen und spezifizieren.
7. Vollständige Umsetzung anhand der finalen Dokumentation.

Ergänzung (D-062): Der erweiterte Gesamtprototyp liegt innerhalb der Schritte 3 bis 5. Schritt 6 (vollständiges Spiel planen, 24 Tage) beginnt erst, wenn der Projektverantwortliche den erweiterten Gesamtprototyp akzeptiert hat.

Konsequenzen für Agenten:

- Code für den Prototyp entsteht erst nach Schritt 2 und auf Grundlage der Dokumentation. Das Gesamtspiel (Adventskalender) wird erst in Schritt 6 spezifiziert und in Schritt 7 umgesetzt.
- Agenten erhalten ein gezieltes Dokumentenset gemäß [agent-guide.md](../agent-guide.md).
- Jede Umsetzung wird gegen die Akzeptanzkriterien des Fachdokuments geprüft (siehe Definition of Done oben).

## Git- und Merge-Regeln (CONFIRMED: D-033)

Standardbranch ist `main`.

- Normale Änderungen dürfen nach erfolgreicher Prüfung und bestandenen Tests selbstständig in `main` übernommen werden.
- Größere Architekturänderungen werden **vor der Umsetzung** mit dem Projektverantwortlichen abgestimmt.
- Änderungen an bestätigten Spielregeln (CONFIRMED-Einträge) benötigen **vorherige Freigabe**.
- Experimentelle Arbeiten bleiben auf separaten Branches, bis sie ausreichend geprüft wurden.
- Commits werden nachvollziehbar beschrieben.
- Zugangsdaten und Tokens gehören nie ins Repository.
- Für den erweiterten Gesamtprototyp gilt zusätzlich und vorrangig der folgende Abschnitt (D-063). Die Möglichkeit, normale Änderungen selbstständig in `main` zu übernehmen, gilt für Funktionen des erweiterten Gesamtprototyps nicht mehr.

## Entwicklungsstruktur des erweiterten Gesamtprototyps (CONFIRMED: D-062, D-063)

### Branches

| Branch | Zweck |
|---|---|
| `main` | Stabiler, vom Projektverantwortlichen akzeptierter Spielstand. Wird live unter `https://serplanet.github.io/frostbound/` gezeigt. |
| `feature/<name>` | Eine neue Funktion (z. B. `feature/rebuild`). Wird immer von aktuellem `main` abgezweigt. Jeder Push veröffentlicht eine Testversion unter `/frostbound/preview/<name>/`. |
| `chore/<name>` | Vorbereitung und Technik ohne Spielfunktion (z. B. Infrastruktur, Dokumentation). Wird geprüft (CI), aber nicht veröffentlicht. |
| `gh-pages` | Nur veröffentlichte Build-Dateien, kein Quellcode. Wird ausschließlich von den Workflows geschrieben. |

### Ablauf einer Funktion

1. Der Agent entwickelt die Funktion auf `feature/<name>`, ergänzt Selbsttests und Dokumentation und prüft die Akzeptanzkriterien.
2. Bei jedem Push prüft die CI (`npm ci`, `npm run build`, `node src/tests/selftest.ts`). Nur bei Erfolg wird die Testversion veröffentlicht.
3. Der Agent berichtet: Testversion-URL, was geprüft wurde, was nicht. Er erklärt die Funktion höchstens als „technisch abgeschlossen“ und „erfolgreich getestet“ (Definition of Done).
4. Der Projektverantwortliche spielt die Testversion und gibt Feedback. Der Agent arbeitet es auf demselben Branch ein, die Testversion aktualisiert sich.
5. Erst nach ausdrücklicher Freigabe („akzeptiert“) durch den Projektverantwortlichen wird der Branch in `main` integriert (Pull Request, anschließend Branch löschen, die Testversion wird entfernt).
6. Nach der Integration wird die Funktion im Entscheidungsprotokoll und im Fachdokument festgehalten.

### Regeln

- Keine unfertigen Funktionen direkt auf `main`.
- Keine Integration ohne ausdrückliche Freigabe des Projektverantwortlichen.
- Kein Agent erklärt eine Funktion für akzeptiert, die der Projektverantwortliche noch nicht getestet hat. „Inhaltlich akzeptiert“ erklärt nur der Projektverantwortliche.
- Jede größere Funktion ist separat testbar (eigene Testversion, nach Möglichkeit ein eigener Testmodus `?mode=…`, siehe [testing-and-greybox.md](../technical/testing-and-greybox.md)).
- Unabhängige Aufgaben dürfen parallel auf getrennten Branches bearbeitet werden, wenn keine Konflikte entstehen. Berühren zwei Aufgaben dieselben Dateien (z. B. `config.ts`, `world.ts`, `selftest.ts`), wird die Reihenfolge vorher abgestimmt. Ein Branch holt `main` regelmäßig nach, bevor er zur Abnahme vorgelegt wird.
- Änderungen an bestätigten Spielregeln (CONFIRMED) und größere Architekturänderungen brauchen weiterhin vorab die Freigabe (D-033 b, c). Das betrifft insbesondere den Umbau des Zuges auf beliebig viele Teile.
- Die Live-Einstellung von GitHub Pages (Quelle, Domain) wird nur nach ausdrücklicher Zustimmung geändert.
- Testwerte und Funktionen, die nur zum Testen existieren, sind in Konfiguration und Dokumentation als TESTWERT bzw. OPEN gekennzeichnet.
