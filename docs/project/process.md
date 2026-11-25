# Entwicklungsprozess und Dokumentationsregeln

**Zweck:** Legt fest, wie dokumentiert wird und wie Agenten arbeiten sollen.
**Zielgruppe:** Alle, besonders Agenten, die Dokumente ändern.
**Abhängigkeiten:** keine.

## Dokumentationsregeln

Der Statuswortschatz CONFIRMED, PROPOSED, OPEN gilt für alle Designentscheidungen (CONFIRMED: D-028).

1. Eine Idee wird nicht bestätigt, nur weil sie in einem Gespräch erwähnt wurde. Bestätigt ist nur, was der Projektverantwortliche ausdrücklich bestätigt.
2. Jedes Dokument hat einen eindeutigen Zweck, nennt Zielgruppe und Abhängigkeiten und ist eigenständig lesbar.
3. Bestätigtes, Vorgeschlagenes und Offenes sind sichtbar getrennt und mit Status markiert.
4. Neue bestätigte Entscheidung: Eintrag im [Entscheidungsprotokoll](decision-log.md) mit neuer D-ID, dann das betroffene Fachdokument anpassen. Ändert sich eine Entscheidung, wird der alte Eintrag nicht gelöscht, sondern als „ersetzt durch D-xxx“ markiert.
5. Neue offene Frage: Eintrag in [open-questions.md](../open-questions.md) mit Q-ID und im betroffenen Fachdokument als OPEN. Wird sie entschieden, wird der Q-Eintrag auf „entschieden“ gesetzt und auf die D-ID verwiesen.
6. Keine Widersprüche zwischen Dokumenten. Bei Zweifel gilt das Entscheidungsprotokoll.
7. Zahlenwerte nur, wenn CONFIRMED. Sonst als OPEN führen.
8. Möglichst wenige Dokumente. Neue Dokumente nur bei klar eigenständigem Zweck, und sie werden in [README.md](../README.md) und [agent-guide.md](../agent-guide.md) eingetragen.

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
2. Dokumentation erstellen und vervollständigen. (aktuell)
3. Prototyp auf Grundlage der Dokumentation entwickeln.
4. Nutzerfeedback einholen.
5. Prototyp anhand des Feedbacks verbessern. Die Schritte 4 und 5 werden wiederholt, bis der Projektverantwortliche zufrieden ist.
6. Vollständiges Spiel durchplanen und spezifizieren.
7. Vollständige Umsetzung anhand der finalen Dokumentation.

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
- Commits werden nachvollziehbar beschrieben. Weitere Git-Regeln sind nicht festgelegt.
- Zugangsdaten und Tokens gehören nie ins Repository.
