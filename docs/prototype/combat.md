# Kampf und automatische Angriffe

**Zweck:** Beschreibt den automatischen Spielerangriff und das automatische Zuggeschütz.
**Zielgruppe:** Gameplay-Agent Kampf.
**Abhängigkeiten:** [player.md](player.md), [enemies.md](enemies.md); Architektur: [../technical/architecture.md](../technical/architecture.md).

## Bestätigte Regeln

- CONFIRMED: Der Spieler greift automatisch an (D-008).
- CONFIRMED: Ein automatisches Zuggeschütz sucht das nächste geeignete Ziel und schießt darauf (D-009).
- CONFIRMED: Überhitzung ist im ersten Prototyp nicht implementiert (D-010).

## Offen

- OPEN: Angriffsreichweite und genaue Zielauswahl, was „geeignet“ bedeutet (Q-005). „Nächstes“ ist bestätigt, die Bezugsgröße des Abstands ist es nicht ausdrücklich (OPEN, Q-005).
- OPEN: Verhältnis Spielerangriff ↔ Zuggeschütz: zwei Quellen oder eine? (Q-013).
- OPEN: Schaden, Feuerrate, Projektilart, Munition, Gegnerlebenspunkte (Q-004, Q-006).

## Anforderungen

### REQ-CMB-001 – Automatischer Angriff ohne Eingabe
- **Problemstellung:** Angreifen soll keine Spielereingabe erfordern.
- **Ziel:** Angriffe laufen automatisch.
- **Gewünschtes Verhalten:** Die automatische Angriffsquelle (siehe Q-013) löst Angriffe ohne Taste oder Klick aus, sobald ein Ziel vorhanden ist.
- **Akzeptanzkriterien:** (1) Es existiert keine Eingabe zum Auslösen eines Angriffs. (2) Ist ein gültiges Ziel in Reichweite, wird angegriffen. (3) Ist keins vorhanden, wird nicht angegriffen. (4) Reichweite und Feuerrate sind Konfiguration.
- **Testfälle:** auto: Ziel in Reichweite → Angriff erfolgt ohne Eingabe; kein Ziel → kein Angriff.
- **Abhängigkeiten:** Q-005, Q-013.
- **Entscheidungsstatus:** CONFIRMED (Prinzip); OPEN (Quelle, Werte).

### REQ-CMB-002 – Geschütz wählt nächstes geeignetes Ziel
- **Problemstellung:** Das Geschütz soll deterministisch ein Ziel wählen.
- **Ziel:** Auswahl des nächsten geeigneten Ziels.
- **Gewünschtes Verhalten:** Unter allen als geeignet geltenden Gegnern wird der nächstgelegene ausgewählt und beschossen. Die Eignungsregel ist austauschbar gekapselt.
- **Akzeptanzkriterien:** (1) Bei mehreren geeigneten Gegnern wird der mit dem kleinsten Abstand gewählt. (2) Ungeeignete Gegner werden nicht gewählt. (3) Die Eignungsregel ist eine austauschbare Funktion. Der Standard ist bis zur Entscheidung nicht festgelegt (OPEN). Tests nutzen eine explizit im Test definierte Regel.
- **Testfälle:** auto: Gegner an definierten Positionen, Testregel „alle geeignet“ → nächster wird gewählt. Testregel schließt einen aus → dieser wird nie gewählt.
- **Abhängigkeiten:** Q-005.
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
