# Schwierigkeitsgrade

**Zweck:** Beschreibt die drei Schwierigkeitsgrade und deren Wirkung.
**Zielgruppe:** Balancing- und Gameplay-Agenten.
**Abhängigkeiten:** [enemies.md](enemies.md), [core-gameplay.md](core-gameplay.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt drei Schwierigkeitsgrade: **Gemütlich**, **Normal**, **Winterhart** (D-021).
- CONFIRMED: Sie beeinflussen unter anderem die Gegneranzahl (D-021).

## Offen

- OPEN: Exakte Gegneranzahl pro Grad (Q-001) und alle weiteren Werte.
- OPEN: Ob außer der Gegneranzahl weitere Parameter beeinflusst werden („unter anderem“ ist bestätigt, die Liste nicht), Q-019.
- OPEN: Wie der Grad gewählt wird (Q-019). Standardgrad: OPEN.
- OPEN: Reihenfolge/Beziehung der Schwierigkeit (z. B. Gemütlich < Normal < Winterhart) ist durch die Namensreihenfolge nahegelegt, aber nicht ausdrücklich bestätigt.

## Anforderungen

### REQ-DIF-001 – Drei wählbare Schwierigkeitsgrade
- **Problemstellung:** Das Spiel braucht definierte Schwierigkeitsprofile.
- **Ziel:** Genau drei Profile mit diesen Namen.
- **Gewünschtes Verhalten:** Es existieren die Profile „Gemütlich“, „Normal“, „Winterhart“. Ein Profil ist ein Konfigurationsobjekt (Datenstruktur), das Gameplay-Parameter überschreibt.
- **Akzeptanzkriterien:** (1) Genau diese drei Profile existieren. (2) Gameplay liest Parameter über das aktive Profil, nicht aus festen Konstanten. (3) Profile sind ohne Codeänderung der Logik austauschbar.
- **Testfälle:** auto: Die Profilliste hat drei Einträge mit den Namen. auto: Wechsel des Profils ändert den gelesenen Wert.
- **Abhängigkeiten:** Q-019 für Auswahlmechanismus.
- **Entscheidungsstatus:** CONFIRMED (D-021); OPEN (Auswahl, Standard).

### REQ-DIF-002 – Gegneranzahl hängt vom Grad ab
- **Problemstellung:** Schwierigkeit soll die Gegneranzahl beeinflussen.
- **Ziel:** Die Gegneranzahl ist pro Profil konfigurierbar.
- **Gewünschtes Verhalten:** Der Wellenplan bezieht die Gegneranzahl aus dem aktiven Profil.
- **Akzeptanzkriterien:** (1) Wechsel des Profils kann die erzeugte Gegneranzahl ändern. (2) Konkrete Anzahlen stehen ausschließlich in Konfigurationsdaten. (3) Es sind keine Anzahlen als Spielwerte dokumentiert, solange Q-001 offen ist.
- **Testfälle:** auto: Mit Testprofilen (Testdaten) A und B mit unterschiedlicher Anzahl werden entsprechend unterschiedlich viele Spawns erzeugt.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-002), Q-001.
- **Entscheidungsstatus:** CONFIRMED (Prinzip); OPEN (Werte).

## Menschliche Bewertung

Ob die Grade sich passend „gemütlich“, „normal“ und „winterhart“ anfühlen, bewertet der Projektverantwortliche.
