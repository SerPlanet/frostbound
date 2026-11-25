# Schwierigkeitsgrade

**Zweck:** Beschreibt die drei Schwierigkeitsgrade und deren Wirkung.
**Zielgruppe:** Balancing- und Gameplay-Agenten.
**Abhängigkeiten:** [enemies.md](enemies.md), [core-gameplay.md](core-gameplay.md), [balance-and-statistics.md](balance-and-statistics.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt drei Schwierigkeitsgrade: **Gemütlich**, **Normal**, **Winterhart** (D-021).
- CONFIRMED: Sie beeinflussen unter anderem die Gegneranzahl (D-021). Die Gesamtzahl der Gegner wird festgelegt und kann je Schwierigkeitsgrad variieren (D-031).
- CONFIRMED: Die Schwierigkeit soll hauptsächlich durch Anzahl und Masse der Gegner entstehen (D-038).
- CONFIRMED: Die konkreten Gegnerzahlen und Spawnwerte sind nicht entschieden. Für den ersten Prototyp werden vorläufige Startwerte verwendet, die später anhand von Tests angepasst werden (D-045).
- CONFIRMED: Die Auswahl erfolgt im Spielablauf nach dem Startbildschirm (D-047).

## Offen

- OPEN (Tuning): Konkrete Gesamtzahl der Gegner je Grad (Q-001), Spawnwerte (Q-002, Q-003, Q-018).
- OPEN: Ob weitere Parameter außer der Gegneranzahl beeinflusst werden („unter anderem“ ist bestätigt, die Liste nicht), voreingestellter Grad (Q-019).
- OPEN: Reihenfolge der Schwierigkeit (z. B. Gemütlich < Normal < Winterhart) ist durch die Namen nahegelegt, aber nicht ausdrücklich bestätigt.

## Vorläufige Startwerte (PROPOSED, nicht bestätigt)

Dies ist ein **Vorschlag zur Freigabe** als erster Testsatz im Sinne von D-045. Er ist nicht bindend, keine Designaussage und wird anhand von Tests angepasst.

| Grad | Gesamtzahl Gegner N (Vorschlag) |
|---|---|
| Gemütlich | 25 |
| Normal | 40 |
| Winterhart | 60 |

Weitere Startwerte (Spawnintervalle, Gruppengrößen, Gegnerwerte) stehen als Parametertabelle im [Balance-Modell](balance-and-statistics.md). Der Wellenplan verteilt die Gegnergesamtzahl entsprechend der Verlaufsform (Anfang einzeln und mit längeren Pausen, Mitte kleinere Gruppen mit höherer Spawnrate, später größere Gruppen, REQ-CORE-002).

## Anforderungen

### REQ-DIF-001 – Drei wählbare Schwierigkeitsgrade
- **Problemstellung:** Das Spiel braucht definierte Schwierigkeitsprofile.
- **Ziel:** Genau drei Profile mit diesen Namen.
- **Gewünschtes Verhalten:** Es existieren die Profile „Gemütlich“, „Normal“, „Winterhart“. Ein Profil ist ein Konfigurationsobjekt, das Gameplay-Parameter überschreibt.
- **Akzeptanzkriterien:** (1) Genau diese drei Profile existieren. (2) Gameplay liest Parameter über das aktive Profil, nicht aus festen Konstanten. (3) Profile sind ohne Codeänderung der Logik austauschbar. (4) Auswahl siehe REQ-FLOW-002.
- **Testfälle:** auto: Die Profilliste hat drei Einträge mit diesen Namen. auto: Wechsel des Profils ändert den gelesenen Wert.
- **Abhängigkeiten:** ui-and-flow (REQ-FLOW-002), Q-019.
- **Entscheidungsstatus:** CONFIRMED (D-021, D-047); OPEN (Standardgrad).

### REQ-DIF-002 – Gegnergesamtzahl hängt vom Grad ab
- **Problemstellung:** Die Schwierigkeit soll die Gegneranzahl beeinflussen.
- **Ziel:** Die Gesamtzahl der Gegner ist pro Profil konfigurierbar.
- **Gewünschtes Verhalten:** Der Wellenplan bezieht die Gegnergesamtzahl aus dem aktiven Profil.
- **Akzeptanzkriterien:** (1) Wechsel des Profils kann die erzeugte Gegnergesamtzahl ändern. (2) Konkrete Anzahlen stehen ausschließlich in Konfigurationsdaten. (3) Die Zahlen sind als vorläufig markiert, bis sie freigegeben sind (D-045). (4) Der Prototyp läuft mit den vorläufigen Startwerten.
- **Testfälle:** auto: Mit Testprofilen A und B mit unterschiedlicher Anzahl werden entsprechend viele Spawns erzeugt.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-002), Q-001.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-031, D-045); OPEN/PROPOSED (Werte).

## Menschliche Bewertung

Ob die Grade sich passend „gemütlich“, „normal“ und „winterhart“ anfühlen, bewertet der Projektverantwortliche.
