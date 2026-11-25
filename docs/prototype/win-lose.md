# Sieg- und Niederlagebedingungen

**Zweck:** Beschreibt, wann eine Runde gewonnen oder verloren ist und was danach passiert.
**Zielgruppe:** Gameplay-Agent Spielablauf.
**Abhängigkeiten:** [train-and-defense.md](train-and-defense.md), [enemies.md](enemies.md), [ui-and-flow.md](ui-and-flow.md), [balance-and-statistics.md](balance-and-statistics.md).

## Bestätigte Regeln

- CONFIRMED: Der Spieler kann nicht sterben (D-011). Eine Niederlage durch Spielertod gibt es nicht.
- CONFIRMED **Niederlage (Game Over):** Sie tritt ein, wenn alle Zugteile zerstört sind. Die Lokomotive zählt als Zugteil. Solange mindestens ein Zugteil nicht zerstört ist, läuft die Runde weiter (D-042).
- CONFIRMED: Nach einer Niederlage kann eine neue Runde gestartet werden (D-042). Der Weg führt über den Ergebnisbildschirm zum Startbildschirm (D-047).
- CONFIRMED **Sieg:** Er tritt ein, wenn alle vorgesehenen Gegner der Runde besiegt wurden. Es dürfen keine weiteren Gegner mehr für diese Runde ausstehen (D-044).
- CONFIRMED: Der Erfolg beruht nicht auf einer festen Spieldauer (D-031).
- CONFIRMED: Der Prototyp hat eine größere Angriffswelle (D-019).

## Offen

- OPEN: Zählen Gegner, die den Zug erreicht haben und despawnt sind, als „erledigt“? Wörtlich genommen sind sie nicht „besiegt“. Ohne Klärung ist unklar, ob ein Sieg nach einem Durchbruch erreichbar ist (Q-024). Bis zur Klärung werden keine Annahmen im Code festgeschrieben.
- OPEN: Was passiert, wenn der letzte Gegner despawnt und gleichzeitig das letzte Zugteil zerstört wird (Gleichzeitigkeit). Wird mit Q-024 geklärt.

## Anforderungen

### REQ-WL-001 – Keine Niederlage durch Spielertod
- **Problemstellung:** Klarstellung, dass Spielertod keine Rolle spielt.
- **Ziel:** Die Spielende-Logik hängt nicht vom Spielerzustand ab.
- **Gewünschtes Verhalten:** Siehe REQ-PLR-002.
- **Akzeptanzkriterien:** Keine Spielende-Bedingung liest einen Spieler-Lebenszustand.
- **Testfälle:** auto/Code-Review.
- **Abhängigkeiten:** player.
- **Entscheidungsstatus:** CONFIRMED (D-011).

### REQ-WL-002 – Niederlage, wenn alle Zugteile zerstört sind
- **Problemstellung:** Das Rundenende bei Misserfolg muss eindeutig sein.
- **Ziel:** Game Over genau dann, wenn kein Zugteil mehr nicht zerstört ist.
- **Gewünschtes Verhalten:** Die Runde endet mit Niederlage, sobald alle Zugteile (Lokomotive und Wagon) vollständig zerstört sind. Solange mindestens ein Zugteil nicht zerstört ist, läuft die Runde weiter.
- **Akzeptanzkriterien:** (1) Beide Zugteile zerstört → Rundenergebnis „Niederlage“. (2) Mindestens ein Zugteil nicht zerstört → Runde läuft weiter, auch wenn der Wagon oder die Lokomotive zerstört ist. (3) Ein Teil in laufender Reparatur zählt bis zum vollständigen Abschluss als zerstört. (4) Nach „Niederlage“ werden keine weiteren Spielereignisse mehr verarbeitet, die das Ergebnis ändern.
- **Testfälle:** auto: Lokomotive zerstört, Wagon intakt → Runde läuft. Beide zerstört → Niederlage. Wagon zerstört und in Reparatur (90 %), Lokomotive zerstört → Niederlage (Reparatur nicht abgeschlossen; Auslegung aus D-039/D-041: ein Teil in Reparatur gilt bis zum Abschluss als zerstört).
- **Abhängigkeiten:** train-and-defense (REQ-TRN-003), repair-system.
- **Entscheidungsstatus:** CONFIRMED (D-042).

### REQ-WL-003 – Sieg, wenn alle vorgesehenen Gegner besiegt sind
- **Problemstellung:** Das Rundenende bei Erfolg muss eindeutig sein.
- **Ziel:** Sieg genau dann, wenn alle vorgesehenen Gegner erledigt sind und keine mehr ausstehen.
- **Gewünschtes Verhalten:** Die Runde endet mit Sieg, wenn alle im Wellenplan vorgesehenen Gegner gespawnt und besiegt sind und kein weiterer Gegner mehr aussteht.
- **Akzeptanzkriterien:** (1) Solange noch Gegner im Wellenplan ausstehen (nicht gespawnt), ist kein Sieg möglich. (2) Solange lebende Gegner im Spielfeld sind, ist kein Sieg möglich. (3) Sind alle Gegner gespawnt und keiner lebt mehr, tritt Sieg ein. Wie despawnte Durchbruch-Gegner gezählt werden, ist nicht festgelegt (Q-024). Das Kriterium wird mit der Entscheidung präzisiert. (4) Die Bedingung ist nicht zeitbasiert.
- **Testfälle:** auto: Plan mit 3 Gegnern, 2 besiegt, 1 ausstehend → kein Sieg. Alle besiegt → Sieg. Test mit Durchbruch-Gegnern wird erst nach Entscheidung Q-024 geschrieben.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-002), combat (REQ-CMB-005), Q-024.
- **Entscheidungsstatus:** CONFIRMED (D-044); OPEN (Zählung von Durchbrüchen).

### REQ-WL-004 – Neue Runde nach Rundenende
- **Problemstellung:** Nach Sieg oder Niederlage muss eine neue Runde möglich sein.
- **Ziel:** Wiederholbare Runden.
- **Gewünschtes Verhalten:** Nach dem Ergebnisbildschirm erreicht man den Startbildschirm und kann eine neue Runde starten (siehe REQ-FLOW-001).
- **Akzeptanzkriterien:** Eine neue Runde startet mit vollständig zurückgesetztem Zustand. Die Ergebnisse der vorigen Runde beeinflussen sie nicht.
- **Testfälle:** auto: Niederlage → neuer Start → Ausgangszustand identisch mit dem ersten Start.
- **Abhängigkeiten:** ui-and-flow.
- **Entscheidungsstatus:** CONFIRMED (D-042, D-047).
