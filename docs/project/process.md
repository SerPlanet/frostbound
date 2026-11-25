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

## Entwicklungsprozess

Der Prozess ist bislang nicht ausdrücklich bestätigt. Alle Punkte sind daher PROPOSED:

- PROPOSED: Zuerst Design und Dokumentation, dann Umsetzung. Offene Fragen, die eine Umsetzung blockieren, werden vorher geklärt.
- PROPOSED: Agenten erhalten ein gezieltes Dokumentenset gemäß [agent-guide.md](../agent-guide.md).
- PROPOSED: Jede Umsetzung wird gegen die Akzeptanzkriterien des Fachdokuments geprüft. Wo noch keine festgelegt sind, wird das ausdrücklich genannt.
- PROPOSED: Änderungen werden in nachvollziehbaren Commits festgehalten. Ein Branch-Modell ist OPEN (Q-021).
