# Kampf und automatische Angriffe

**Zweck:** Beschreibt die zwei unabhängigen automatischen Angriffsquellen: Spielerangriff und Zuggeschütz.
**Zielgruppe:** Gameplay-Agent Kampf.
**Abhängigkeiten:** [player.md](player.md), [enemies.md](enemies.md); Architektur: [../technical/architecture.md](../technical/architecture.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt zwei voneinander unabhängige automatische Angriffsquellen (D-030):
  - Der Spieler besitzt einen eigenen automatischen Angriff (D-008).
  - Das Zuggeschütz besitzt einen eigenen automatischen Angriff. Es sucht das nächste geeignete Ziel und schießt darauf (D-009).
- CONFIRMED: Überhitzung ist im ersten Prototyp nicht implementiert (D-010).

## Offen

- OPEN: Angriffsreichweite und genaue Zielauswahl, jeweils für den Spielerangriff und das Zuggeschütz. Insbesondere, was für das Geschütz „geeignet“ bedeutet und wie der Spielerangriff sein Ziel wählt (Q-005). „Nächstes“ ist für das Geschütz bestätigt, die Bezugsgröße des Abstands ist es nicht ausdrücklich (Q-005).
- OPEN: Schaden, Feuerrate, Projektilart, Munition, Gegnerlebenspunkte (Q-004, Q-006).

## Anforderungen

### REQ-CMB-001 – Zwei unabhängige automatische Angriffsquellen
- **Problemstellung:** Angreifen soll keine Eingabe erfordern, und Spieler und Zuggeschütz sollen je einen eigenen Angriff besitzen.
- **Ziel:** Spielerangriff und Geschützangriff laufen automatisch und unabhängig voneinander.
- **Gewünschtes Verhalten:** Spieler und Zuggeschütz besitzen je einen eigenen automatischen Angriff mit eigenem Zustand und eigener Konfiguration. Beide lösen ohne Taste oder Klick Angriffe aus, sobald ein gültiges Ziel in ihrer Reichweite ist.
- **Akzeptanzkriterien:** (1) Es existieren genau diese zwei Angriffsquellen: Spielerangriff und Geschützangriff. (2) Es existiert keine Eingabe zum Auslösen eines Angriffs. (3) Ist die eine Quelle deaktiviert, feuert die andere unverändert weiter (Unabhängigkeit). (4) Jede Quelle hat eigene Konfiguration für Reichweite, Feuerrate und Schaden und teilt keinen Zustand wie Abklingzeit oder Zielwahl mit der anderen. (5) Ist kein gültiges Ziel in Reichweite, greift die jeweilige Quelle nicht an.
- **Testfälle:** auto: Nur Spielerangriff aktiv → nur dieser feuert. Nur Geschütz aktiv → nur dieses feuert. Beide aktiv → beide feuern unabhängig, die Abklingzeiten beeinflussen sich nicht. auto: Ziel in Reichweite → Angriff ohne Eingabe, kein Ziel → kein Angriff.
- **Abhängigkeiten:** Q-005 (Reichweite und Zielauswahl je Quelle), Q-004 (Gegnerwerte).
- **Entscheidungsstatus:** CONFIRMED (Anzahl und Unabhängigkeit der Quellen, D-008, D-030); OPEN (Werte, Zielwahl des Spielerangriffs).

### REQ-CMB-002 – Geschütz wählt nächstes geeignetes Ziel
- **Problemstellung:** Das Geschütz soll deterministisch ein Ziel wählen.
- **Ziel:** Auswahl des nächsten geeigneten Ziels.
- **Gewünschtes Verhalten:** Unter allen als geeignet geltenden Gegnern wird der nächstgelegene ausgewählt und beschossen. Die Eignungsregel ist austauschbar gekapselt.
- **Akzeptanzkriterien:** (1) Bei mehreren geeigneten Gegnern wird der mit dem kleinsten Abstand gewählt. (2) Ungeeignete Gegner werden nicht gewählt. (3) Die Eignungsregel ist eine austauschbare Funktion. Der Standard ist bis zur Entscheidung nicht festgelegt (OPEN). Tests nutzen eine explizit im Test definierte Regel.
- **Testfälle:** auto: Gegner an definierten Positionen, Testregel „alle geeignet“ → nächster wird gewählt. Testregel schließt einen aus → dieser wird nie gewählt.
- **Abhängigkeiten:** Q-005. Gilt für das Zuggeschütz. Die Zielwahl des Spielerangriffs ist nicht festgelegt (Q-005).
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-009); OPEN („geeignet“, Abstandsbezug).

### REQ-CMB-003 – Keine Überhitzung
- **Problemstellung:** Überhitzung gehört nicht in den Prototyp.
- **Ziel:** Kein Überhitzungssystem.
- **Gewünschtes Verhalten:** Das Geschütz kennt keinen Hitzezustand.
- **Akzeptanzkriterien:** Es gibt keinen Hitzewert, keine Hitzeanzeige und keine Abschaltung wegen Hitze im Prototyp.
- **Testfälle:** manuell/Code-Review: Suche nach Hitze-Logik ergibt nichts.
- **Abhängigkeiten:** –
- **Entscheidungsstatus:** CONFIRMED (D-010).

## Menschliche Bewertung

Wie sich Treffer, Schüsse und Abwehr „anfühlen“, bewertet der Projektverantwortliche.
