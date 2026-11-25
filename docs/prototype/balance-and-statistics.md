# Balance-Modell und Rundenstatistik

**Zweck:** Beschreibt ein einfaches mathematisches Balance-Modell für den Prototyp und die Statistik, die nach jeder Runde erfasst wird.
**Zielgruppe:** Balancing-Agent, Gameplay-Agent Statistik.
**Abhängigkeiten:** [combat.md](combat.md), [enemies.md](enemies.md), [train-and-defense.md](train-and-defense.md), [repair-system.md](repair-system.md), [difficulty.md](difficulty.md). Begriffe: [../project/glossary.md](../project/glossary.md).

## Grundsätze (CONFIRMED: D-048, D-045)

- Das Modell ist möglichst einfach. Es werden keine komplexen externen Simulationswerkzeuge entwickelt.
- Theoretische Berechnung und tatsächliches Spielverhalten werden getrennt betrachtet. Die Formeln sind **Näherungen**, keine Garantie für den Spielverlauf.
- Alle Zahlenwerte sind **vorläufig**, solange sie nicht ausdrücklich bestätigt wurden. Sie sollen später zentral und einfach änderbar sein (technische Umsetzung: REQ-ARC-004, TECH-03).
- Spieler und Zuggeschütz greifen unabhängig voneinander an (D-030). Ihre Beiträge werden getrennt gerechnet und addiert.
- Die Schwierigkeit entsteht hauptsächlich durch Anzahl und Masse der Gegner (D-038), nicht durch einzelne starke Gegner.

## 1. Parameter

Spalte „Status“: **CONFIRMED** = bestätigter Startwert für den Prototyp (D-053, D-052, D-056), **TESTWERT** = vorläufig, im Spieltest anzupassen (Quelle: [../technical/architecture.md](../technical/architecture.md), Abschnitt Testwerte). LE = logische Einheit des Spielfeldes (Spielfeld 1280 × 720 LE, TECH-01).

| Symbol | Bedeutung | Wert | Status |
|---|---|---|---|
| h | Lebenspunkte eines Gegners | 3 | TESTWERT |
| v | Gegnertempo in LE/s | 40 | TESTWERT |
| s | Schaden eines Gegners am Zugteil | 10 | CONFIRMED |
| L | Weg eines Gegners im sichtbaren Spielfeld bis zum Zug in LE | ca. 600 | TECH (aus dem Layout) |
| d_p, f_p | Spielerschaden, Spielerfeuerrate (1/s) | 1 und 1,43 (Teststand 1, vorher 1) | TESTWERT |
| R_p | Reichweite des Spielerangriffs in LE | 90 | TESTWERT |
| d_t, f_t | Geschützschaden, Geschützfeuerrate (1/s) | 1 und 0,4 (Teststand 1, vorher 1) | TESTWERT |
| HP_L, HP_W, HP_G | Lebenspunkte Lokomotive, Wagon, Geschütz | 100, 100, 20 | CONFIRMED |
| r | Reparaturleistung, Mittel: 5 HP je 5 s | 1 HP/s (bestätigt, D-056). Im Teststand 1 vorläufig 2 HP/s (5 HP je 2,5 s, TESTWERT) | CONFIRMED / TESTWERT |
| N | Gesamtzahl der Gegner | siehe [difficulty.md](difficulty.md) | TESTWERT |

Das Geschütz hat das gesamte Spielfeld als Reichweite (D-037). Seine Reichweite ist kein Parameter. Das Geschütz wird im Prototyp nicht angegriffen, HP_G geht nicht in die Schadensrechnung ein.

## 2. Grundformeln (Näherungen)

Alle Formeln bilden eine **obere Schranke bzw. Mittelwerte**. Sie ignorieren Überschuss-Schaden (Overkill), Zielwechsel, Positionswege und zufällige Schwankungen.

1. **Schaden pro Sekunde je Quelle:** DPS_p = d_p · f_p, DPS_t = d_t · f_t.
2. **Kills pro Sekunde je Quelle:** K_t = DPS_t / h. K_p = a_p · DPS_p / h.
   - a_p (0 bis 1) ist der Anteil der Zeit, in dem sich mindestens ein Gegner in Spielerreichweite R_p befindet und der Spieler angreifen kann. Er hängt stark vom Spielerverhalten ab und ist nicht theoretisch bestimmbar. Als Rechenbasis wird er als Annahme angegeben.
3. **Gesamt-Kills pro Sekunde:** K = K_t + K_p (die Quellen sind unabhängig).
4. **Gegner pro Sekunde:** λ(t) = Spawnrate laut Wellenplan. Mittelwert über die Spawnphase: λ̄ = N / T_s. T_s ist die Dauer der Spawnphase, ein **Ergebnis** des Wellenplans, keine Zielgröße (D-031).
5. **Auslastung:** ρ = λ / K. Bei ρ < 1 liegt die Spawnrate unter der Abwehrkapazität. Bei ρ > 1 entsteht ein Rückstau.
6. **Laufzeit im Spielfeld:** τ = L / v. In dieser Zeit können Gegner beschossen werden, bevor sie den Zug erreichen.
7. **Durchbrüche bei einem Schub** von n Gegnern, die innerhalb der Zeit δ eintreten: b = max(0, n − K · (δ + τ)). Durchbruchrate des Schubs: B = b / n.
   - Näherung für gleichmäßigen Zustrom: B ≈ max(0, 1 − K/λ).
8. **Eingehender Schaden:** D_in = b · s. Mittlerer eingehender Schaden pro Sekunde: D_in / Dauer des Schubs bzw. λ_b · s mit λ_b = Durchbruchrate pro Sekunde.
9. **Verteilung auf Zugteile:** Jeder Gegner wählt zufällig zwischen Lokomotive und Wagon (D-039). Bei gleicher Wahrscheinlichkeit (TECH-07): D_L ≈ D_W ≈ D_in / 2. Zerstörte Teile sind keine Ziele (D-039, D-051), danach geht der gesamte Schaden an die verbleibenden intakten Teile.
10. **Zeit bis zur Zerstörung eines Teils:** t_zerstört = HP_Teil / (Schadensrate am Teil), ohne Reparatur.
11. **Reparatur:** Netto-HP-Änderung je Sekunde eines Teils ≈ a_r · r − Schadensrate am Teil. a_r (0 bis 1) ist der Anteil der Zeit, in dem der Spieler im Reparaturbereich dieses Objekts steht und es nach der Priorität auch repariert wird. Es wird immer nur ein Objekt repariert (D-043), und währenddessen ist der Spieler an den Bereich gebunden, sodass a_p und a_r sich gegenseitig einschränken können (abhängig von der Lage der Bereiche, TECH-09).
12. **Reparaturdauer eines Teils:** t_rep = (HP_max − HP_aktuell) / 5 · 5 s. Bei Aufenthalt in der Zone ist sie exakt, sonst gilt die Anwesenheit a_r. Das Reparaturmodell ist bestätigt: 5 HP je 5 Sekunden Aufenthalt, vollständige Reparatur von 0 auf 100 HP = 100 s (D-056).
13. **Theoretische Verteidigungsleistung:** Q_def = min(1, K · (T_s + τ) / N). Anteil der Gegner, die rechnerisch abgewehrt werden könnten. 1 − Q_def ist die theoretische Mindestdurchbruchquote.

## 3. Rechenbeispiel (nur zur Veranschaulichung)

Hinweis: Das Beispiel rechnet mit den ersten Startwerten (Angriffsintervalle je 1 s, 1 HP/s, früherer Wellenplan) und wurde für den Balance-Teststand 1 nicht neu berechnet.

Alle Zahlen stammen aus der Tabelle (bestätigte Werte und Testwerte) und der Annahme a_p = 0,5. Sie sind keine Designaussage.

- K_t = 1·1/3 ≈ 0,33/s. K_p = 0,5·1·1/3 ≈ 0,17/s. K = 0,5/s.
- τ = L/v = 600/40 = 15 s.
- Früh: λ = 0,17/s (einzelne Gegner alle 6 s) → ρ ≈ 0,3. Kein Rückstau.
- Mitte: Gruppe von 3 alle 8 s → λ̄ = 0,375/s → ρ = 0,75. Knapp unter der Kapazität.
- Spät, große Welle von n = 20 Gegnern in δ = 10 s (2 pro Sekunde): K·(δ+τ) = 0,5·25 = 12,5 → b = 7,5 → B ≈ 38 %. D_in ≈ 7,5 · 10 = 75 HP, bei gleicher Zielwahl etwa 37 HP je Zugteil.
- Gegen ein Teil mit 100 HP wären das etwa drei solcher Schübe bis zur Zerstörung ohne Reparatur. Die Reparatur liefert 1 HP/s nur im Mittel während der Anwesenheit, bei a_r = 0,3 also etwa 0,3 HP/s oder 30 HP je 100 s. Ein vollständig zerstörtes Teil braucht 100 s Aufenthalt in der Zone (D-056).

## 4. Theorie und Praxis

Das Modell sagt „Wo liegen die Größenordnungen“, nicht „Wie läuft das Spiel“. Abweichungen entstehen u. a. durch:

- Der Spieler greift nur im Nahbereich an (a_p unsicher). Der Spieler kann nicht gleichzeitig angreifen, wo er will, und reparieren, wo er soll.
- Overkill und Zielwechsel des Geschützes („nächstes geeignetes Ziel“, Q-005).
- Zufällige Zielwahl: Der Schaden verteilt sich nicht exakt gleichmäßig.
- Gruppierte Gegner treffen gleichzeitig ein.
- Soforttreffer ohne Projektilflugzeit (TECH-06) im Prototyp. Spätere Projektile würden das Modell verändern.

**Abgleich:** Die Rundenstatistik (REQ-STA-001) liefert die tatsächlichen Werte. Der Vergleich mit den Modellwerten ist eine Aufgabe für Balancing und die Feedbackrunde. Das Modell wird anhand der Messwerte angepasst, nicht umgekehrt.

## Anforderungen

### REQ-BAL-001 – Zentrale, veränderbare Balancewerte
- **Problemstellung:** Viele Werte sind vorläufig und ändern sich nach Tests.
- **Ziel:** Alle Balancewerte stehen zentral und sind leicht änderbar.
- **Gewünschtes Verhalten:** Jeder Parameter aus Abschnitt 1 ist an genau einer Stelle definiert (Konfiguration). Gameplay liest sie von dort.
- **Akzeptanzkriterien:** (1) Kein Balancewert ist in Gameplay-Logik verstreut oder dupliziert. (2) Eine Wertänderung erfordert keine Änderung der Gameplay-Logik. (3) Tests können eigene Werte verwenden.
- **Testfälle:** auto: Zwei Konfigurationen → unterschiedliche Ergebnisse bei gleicher Logik.
- **Abhängigkeiten:** architecture (REQ-ARC-004).
- **Entscheidungsstatus:** CONFIRMED (Ziel „zentral und einfach veränderbar“, D-048); TECH (Form: eine Konfigurationsdatei).

### REQ-BAL-002 – Dokumentiertes Balance-Modell
- **Problemstellung:** Balancing braucht nachvollziehbare Grundformeln.
- **Ziel:** Das Modell dieses Dokuments ist verständlich und die Formeln sind prüfbar.
- **Gewünschtes Verhalten:** Für eine gegebene Parametermenge lassen sich K, λ, ρ, B, D_in, Q_def und t_rep aus den Formeln berechnen.
- **Akzeptanzkriterien:** (1) Das Rechenbeispiel in Abschnitt 3 lässt sich mit den Formeln reproduzieren. (2) Alle Formeln sind in Abschnitt 2 mit Symbolen definiert. (3) Als Näherungen gekennzeichnet.
- **Testfälle:** auto/manuell: Rechenbeispiel mit einem kleinen Skript oder von Hand nachrechnen, Ergebnis stimmt überein. Eine kleine Berechnungshilfe ist erlaubt, ein externes Simulationswerkzeug ist nicht vorgesehen.
- **Abhängigkeiten:** combat, enemies, difficulty.
- **Entscheidungsstatus:** CONFIRMED (Anforderung, D-048); bestätigte Werte laut Tabelle, alle übrigen Zahlen TESTWERT.

### REQ-BAL-003 – Spielgefühl und Balance-Qualität
- **Problemstellung:** Ob die Balance „stimmt“, ist nicht berechenbar.
- **Ziel:** Das subjektive Urteil liegt beim Projektverantwortlichen.
- **Gewünschtes Verhalten:** Spannung, Fairness und Spielspaß werden nicht von Agenten als „erfüllt“ erklärt.
- **Akzeptanzkriterien:** Der Abschlussbericht führt diese Kriterien als menschliche Bewertungsaufgabe.
- **Testfälle:** menschl. Bewertung in der Feedbackrunde.
- **Abhängigkeiten:** process (Definition of Done).
- **Entscheidungsstatus:** CONFIRMED (D-029).

### REQ-STA-001 – Statistik nach jeder Runde
- **Problemstellung:** Balancing und Feedback brauchen Messwerte.
- **Ziel:** Nach jeder Runde (Sieg oder Niederlage) werden folgende Werte erfasst und angezeigt.
- **Gewünschtes Verhalten:** Erfasst und auf dem Ergebnisbildschirm angezeigt:
  1. Anzahl gespawnter Gegner.
  2. Durch den Spieler besiegte Gegner.
  3. Durch das Zuggeschütz besiegte Gegner.
  4. Gegner, die den Zug erreicht haben.
  5. Verursachter Schaden je Zugteil.
  6. Reparaturzeiten.
  7. Rundenergebnis.
- **Akzeptanzkriterien:** (1) Alle sieben Werte sind am Rundenende verfügbar und werden angezeigt. (2) Werte werden während der Runde fortlaufend erfasst, nicht nachträglich geschätzt. (3) Eine neue Runde beginnt mit zurückgesetzter Statistik. (4) Bei einem Sieg gilt: gespawnt = Spieler-Kills + Geschütz-Kills + Zugerreichungen (jeder Gegner ist genau einmal abgearbeitet, D-050). Bei einer Niederlage kann ein Rest aktiv oder nicht gespawnt geblieben sein.
- **Definitionen (TECH):** *Besiegt durch X*: Die Quelle, deren Treffer die Gegnergesundheit auf 0 bringt. *Verursachter Schaden je Zugteil*: Summe des an diesem Zugteil angerichteten Schadens (Gegnerschaden, vor Reparatur). *Reparaturzeit*: Summe der Zeit, in der an einem Objekt aktiv repariert wurde, je Objekt.
- **Testfälle:** auto: Simulierte Runde mit bekannten Ereignissen → erwartete Zähler. auto: Zwei Runden → Statistik der zweiten unabhängig. auto: Summenprüfung (4).
- **Abhängigkeiten:** combat, enemies, train-and-defense, repair-system, ui-and-flow (REQ-FLOW-003), win-lose (REQ-WL-005).
- **Entscheidungsstatus:** CONFIRMED (Liste, D-048); TECH (Definitionen, Darstellung).

### REQ-STA-002 – Keine Live-Entwickleransicht erforderlich
- **Problemstellung:** Abgrenzung des Umfangs.
- **Ziel:** Eine Live-Entwickleransicht ist kein Pflichtbestandteil.
- **Gewünschtes Verhalten:** Statistik wird am Rundenende gezeigt. Eine laufende Entwickleransicht ist optional und niedrig priorisiert.
- **Akzeptanzkriterien:** Der Prototyp gilt auch ohne Live-Entwickleransicht als vollständig.
- **Testfälle:** Entfällt.
- **Abhängigkeiten:** –
- **Entscheidungsstatus:** CONFIRMED (D-048).
