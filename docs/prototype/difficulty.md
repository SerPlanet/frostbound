# Schwierigkeitsgrade

**Zweck:** Beschreibt die drei Schwierigkeitsgrade und deren Wirkung.
**Zielgruppe:** Balancing- und Gameplay-Agenten.
**Abhängigkeiten:** [enemies.md](enemies.md), [core-gameplay.md](core-gameplay.md), [balance-and-statistics.md](balance-and-statistics.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt drei Schwierigkeitsgrade: **Gemütlich**, **Normal**, **Winterhart** (D-021).
- CONFIRMED: Sie beeinflussen unter anderem die Gegneranzahl (D-021). Die Gesamtzahl der Gegner wird festgelegt und kann je Schwierigkeitsgrad variieren (D-031).
- CONFIRMED: Die Schwierigkeit soll hauptsächlich durch Anzahl und Masse der Gegner entstehen (D-038).
- CONFIRMED: Die konkreten Gegnerzahlen und Spawnwerte sind nicht endgültig entschieden. Für den ersten Prototyp werden vorläufige Startwerte verwendet, die später anhand von Tests angepasst werden (D-045).
- CONFIRMED: Die Auswahl erfolgt im Spielablauf nach dem Startbildschirm (D-047).

## Offen

- TESTWERTE: Gesamtzahl der Gegner je Grad (Q-001), Spawnwerte (Q-002, Q-003, Q-018). Die vorläufigen Testwerte stehen unten.
- TECH: Der Schwierigkeitsgrad ändert im Prototyp nur die Wellenplan-Daten (Gesamtzahl und davon abhängige Gruppen), keine anderen Spielwerte; kein voreingestellter Grad (TECH-12).
- Die Reihenfolge Gemütlich < Normal < Winterhart ist durch die Namen nahegelegt und wird in den Testwerten so angenommen.

## Vorläufige Testwerte (TESTWERT, nicht bestätigt)

Dieser Wellenplan ist ein **vorläufiger Startsatz** im Sinne von D-045. Er folgt der bestätigten Verlaufsform: zuerst einzelne Gegner mit längeren Pausen, dann kleinere Gruppen mit höherer Spawnrate, dann eine größere Welle. Zeiten in Sekunden ab Rundenstart. Er wird anhand von Tests angepasst und gilt als nicht bindend.

| Grad | Gesamtzahl N | Phase 1: einzelne Gegner | Phase 2: kleine Gruppen | Phase 3: große Welle |
|---|---:|---|---|---|
| Gemütlich | 47 | 3 Einzelne, Abstand 6 s, ab t = 3 | 10 Gruppen à 3 (30), Abstand 5 s, ab t = 25 | 14 Gegner, 2 pro Sekunde, ab t = 85 |
| Normal | 56 | 4 Einzelne, Abstand 6 s, ab t = 3 | 10 Gruppen à 3 (30), Abstand 5 s, ab t = 26 | 22 Gegner, 1 pro Sekunde, ab t = 91 |
| Winterhart | 63 | 5 Einzelne, Abstand 5 s, ab t = 3 | 12 Gruppen à 3 (36), Abstand 5 s, ab t = 26 | 22 Gegner, 1 pro Sekunde, ab t = 91 |

**Balance-Teststand 1** (TESTWERT, nicht bestätigt; ersetzt die ersten Startwerte, zusammen mit den geänderten Angriffsintervallen und der Reparaturgeschwindigkeit, siehe [balance-and-statistics.md](balance-and-statistics.md)). Summen: Gemütlich 3 + 30 + 14 = 47, Normal 4 + 30 + 22 = 56, Winterhart 5 + 36 + 22 = 63. Die Zeitpunkte sind als Daten in der Konfiguration abgelegt. Eine Gruppe spawnt gleichzeitig, jeder Gegner an einer zufälligen horizontalen Position (TECH-10). Die Pause vor der großen Welle ergibt sich aus den Zeitpunkten.

## Anforderungen

### REQ-DIF-001 – Drei wählbare Schwierigkeitsgrade
- **Problemstellung:** Das Spiel braucht definierte Schwierigkeitsprofile.
- **Ziel:** Genau drei Profile mit diesen Namen.
- **Gewünschtes Verhalten:** Es existieren die Profile „Gemütlich“, „Normal“, „Winterhart“. Ein Profil ist ein Konfigurationsobjekt, das Gameplay-Parameter überschreibt.
- **Akzeptanzkriterien:** (1) Genau diese drei Profile existieren. (2) Gameplay liest Parameter über das aktive Profil, nicht aus festen Konstanten. (3) Profile sind ohne Codeänderung der Logik austauschbar. (4) Auswahl siehe REQ-FLOW-002.
- **Testfälle:** auto: Die Profilliste hat drei Einträge mit diesen Namen. auto: Wechsel des Profils ändert den gelesenen Wert.
- **Abhängigkeiten:** ui-and-flow (REQ-FLOW-002).
- **Entscheidungsstatus:** CONFIRMED (D-021, D-047); TECH (keine Voreinstellung).

### REQ-DIF-002 – Gegnergesamtzahl hängt vom Grad ab
- **Problemstellung:** Die Schwierigkeit soll die Gegneranzahl beeinflussen.
- **Ziel:** Die Gesamtzahl der Gegner ist pro Profil konfigurierbar.
- **Gewünschtes Verhalten:** Der Wellenplan bezieht die Gegnergesamtzahl aus dem aktiven Profil.
- **Akzeptanzkriterien:** (1) Wechsel des Profils kann die erzeugte Gegnergesamtzahl ändern. (2) Konkrete Anzahlen stehen ausschließlich in Konfigurationsdaten. (3) Die Zahlen sind als vorläufig markiert, bis sie freigegeben sind (D-045). (4) Der Prototyp läuft mit den vorläufigen Testwerten dieses Dokuments. (5) Die Summe aller Spawns des Plans entspricht der Gesamtzahl des Grades.
- **Testfälle:** auto: Mit Testprofilen A und B mit unterschiedlicher Anzahl werden entsprechend viele Spawns erzeugt.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-002).
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-031, D-045); TESTWERT (Werte).

## Menschliche Bewertung

Ob die Grade sich passend „gemütlich“, „normal“ und „winterhart“ anfühlen, bewertet der Projektverantwortliche.
