# Sieg- und Niederlagebedingungen

**Zweck:** Beschreibt, wann eine Runde gewonnen oder verloren ist und was danach passiert.
**Zielgruppe:** Gameplay-Agent Spielablauf.
**Abhängigkeiten:** [train-and-defense.md](train-and-defense.md), [enemies.md](enemies.md), [ui-and-flow.md](ui-and-flow.md), [balance-and-statistics.md](balance-and-statistics.md). Begriffe „intakt“ und „abgearbeitet“: [../project/glossary.md](../project/glossary.md).

## Bestätigte Regeln (D-050, D-042, D-011)

- CONFIRMED: Der Spieler kann nicht sterben. Es gibt keine Niederlage durch Spielertod (D-011, D-057).
- CONFIRMED **Sieg:** Eine Runde ist erst gewonnen, wenn alle Gegner der Runde abgearbeitet wurden **und** mindestens ein Zugteil noch intakt ist.
- CONFIRMED: Gegner gelten auch dann als abgearbeitet, wenn sie ihr Ziel erreichen, dort Schaden verursachen und anschließend verschwinden.
- CONFIRMED **Niederlage:** Sobald alle Zugteile zerstört sind, ist die Niederlage sofort eingetreten. Wird das letzte noch intakte Zugteil durch den letzten Gegner zerstört, ist die Runde verloren (kein Sieg).
- CONFIRMED: Bereits vorhandene Gegner dürfen nach Spielende technisch noch weiterlaufen, haben aber keinen Einfluss mehr auf das Ergebnis. Nach Spielende wird die Runde nicht weiter ausgewertet.
- CONFIRMED: Solange mindestens ein Zugteil nicht zerstört ist, läuft die Runde weiter. Nach einer Niederlage kann eine neue Runde gestartet werden (D-042).
- CONFIRMED: Der Erfolg beruht nicht auf einer festen Spieldauer (D-031).

## Offen

Keine Gameplay-Fragen. Darstellung der Ergebnisbildschirme: siehe [ui-and-flow.md](ui-and-flow.md).

## Anforderungen

### REQ-WL-001 – Keine Niederlage durch Spielertod
- **Problemstellung:** Klarstellung, dass Spielertod keine Rolle spielt.
- **Ziel:** Die Spielende-Logik hängt nicht vom Spielerzustand ab.
- **Gewünschtes Verhalten:** Siehe REQ-PLR-002.
- **Akzeptanzkriterien:** Keine Spielende-Bedingung liest einen Spielerzustand.
- **Testfälle:** auto: Spielerposition und Gegner nahe am Spieler ändern das Spielergebnis nicht. Code-Review.
- **Abhängigkeiten:** player.
- **Entscheidungsstatus:** CONFIRMED (D-011).

### REQ-WL-002 – Sofortige Niederlage, wenn alle Zugteile zerstört sind
- **Problemstellung:** Das Rundenende bei Misserfolg muss eindeutig und ohne Verzögerung eintreten.
- **Ziel:** Niederlage genau dann, wenn kein Zugteil mehr intakt ist.
- **Gewünschtes Verhalten:** Im selben Simulationsschritt, in dem das letzte intakte Zugteil zerstört wird, wechselt der Rundenstatus auf „verloren“. Solange mindestens ein Zugteil intakt ist, läuft die Runde weiter.
- **Akzeptanzkriterien:** (1) Beide Zugteile zerstört → Status „verloren“ im selben Schritt. (2) Mindestens ein Zugteil intakt → Status bleibt „läuft“. (3) Ein zerstörtes Teil in laufender Reparatur zählt bis zum Reparaturabschluss als zerstört. (4) Zerstört der letzte Gegner das letzte intakte Teil, lautet das Ergebnis „verloren“, nie „gewonnen“. (5) Die Niederlagenprüfung hat Vorrang vor der Siegprüfung.
- **Testfälle:** auto: Lokomotive zerstört, Wagon intakt → läuft. Beide zerstört → verloren. Wagon zerstört und in Reparatur (90 HP erreicht), Lokomotive wird zerstört → verloren. Letzter Gegner zerstört das letzte intakte Teil → verloren, obwohl keine Gegner mehr ausstehen.
- **Abhängigkeiten:** train-and-defense (REQ-TRN-003).
- **Entscheidungsstatus:** CONFIRMED (D-050, D-042). Punkt (3) folgt aus D-039, D-041 und D-051.

### REQ-WL-003 – Sieg, wenn alle Gegner abgearbeitet sind und ein Zugteil intakt ist
- **Problemstellung:** Das Rundenende bei Erfolg muss eindeutig sein.
- **Ziel:** Sieg genau dann, wenn alle Gegner der Runde abgearbeitet sind und mindestens ein Zugteil intakt ist.
- **Gewünschtes Verhalten:** Sind alle Gegner des Wellenplans gespawnt und keiner mehr aktiv (jeder wurde besiegt oder hat den Zug erreicht, Schaden verursacht und ist verschwunden), und ist mindestens ein Zugteil intakt, lautet das Ergebnis „gewonnen“.
- **Akzeptanzkriterien:** (1) Solange noch Gegner des Plans nicht gespawnt sind, ist kein Sieg möglich. (2) Solange noch ein Gegner aktiv ist, ist kein Sieg möglich. (3) Ein Gegner, der am Zug Schaden verursacht hat und verschwunden ist, zählt als abgearbeitet. (4) Sind alle abgearbeitet und mindestens ein Zugteil intakt → „gewonnen“. (5) Die Bedingung ist nicht zeitbasiert.
- **Testfälle:** auto: Plan mit 3 Gegnern: 2 abgearbeitet, 1 aktiv → läuft. Alle 3 abgearbeitet, davon 2 durch Durchbruch → gewonnen, sofern ein Teil intakt. Der letzte Gegner wird nicht gespawnt → kein Sieg.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-002), enemies (REQ-ENM-003), REQ-WL-002.
- **Entscheidungsstatus:** CONFIRMED (D-050).

### REQ-WL-004 – Neue Runde nach Rundenende
- **Problemstellung:** Nach Sieg oder Niederlage muss eine neue Runde möglich sein.
- **Ziel:** Wiederholbare Runden.
- **Gewünschtes Verhalten:** Nach dem Ergebnisbildschirm erreicht man den Startbildschirm und kann eine neue Runde starten (siehe REQ-FLOW-001).
- **Akzeptanzkriterien:** Eine neue Runde beginnt mit vollständig zurückgesetztem Zustand. Die vorige Runde beeinflusst sie nicht.
- **Testfälle:** auto: Nach einer Runde ergibt ein neuer Start den Ausgangszustand identisch zum ersten Start.
- **Abhängigkeiten:** ui-and-flow.
- **Entscheidungsstatus:** CONFIRMED (D-042, D-047).

### REQ-WL-005 – Keine Auswertung nach Spielende
- **Problemstellung:** Nach dem Rundenende dürfen weiterlaufende Gegner das Ergebnis nicht verändern.
- **Ziel:** Das Rundenergebnis und die Statistik sind nach Spielende eingefroren.
- **Gewünschtes Verhalten:** Sobald der Status „gewonnen“ oder „verloren“ gilt, wird die Runde nicht weiter ausgewertet: kein weiterer Schaden, kein Spawn, keine Statistikänderung, kein Statuswechsel. Gegner dürfen sich darstellerisch weiterbewegen oder angehalten sein.
- **Akzeptanzkriterien:** (1) Nach Spielende verändern weitere Simulationsschritte weder Ergebnis noch Statistik noch Zugzustand. (2) Gegner, die nach Spielende den Zug erreichen, verursachen keinen Schaden und werden nicht gezählt.
- **Testfälle:** auto: Nach „verloren“ 1000 weitere Schritte mit Gegnern am Zug → Statistik und Zustand unverändert.
- **Abhängigkeiten:** REQ-WL-002, REQ-WL-003, balance-and-statistics (REQ-STA-001).
- **Entscheidungsstatus:** CONFIRMED (D-050).
