# Gegner

**Zweck:** Beschreibt Gegnertyp, Spawn, Bewegung, Zielwahl, Schaden und Despawn der Gegner.
**Zielgruppe:** Gameplay-Agent Gegner.
**Abhängigkeiten:** [core-gameplay.md](core-gameplay.md); Schaden am Zug: [train-and-defense.md](train-and-defense.md); Gegneranzahl: [difficulty.md](difficulty.md); Besiegen: [combat.md](combat.md).

## Bestätigte Regeln

- CONFIRMED: Im Prototyp existiert genau ein Gegnertyp (D-038). Spätere Typen dürfen unterschiedliche Geschwindigkeiten besitzen.
- CONFIRMED: Gegner starten oben (gegenüber dem Zug) und dürfen zunächst außerhalb des sichtbaren Bereichs sein. Sie erscheinen nicht mitten im sichtbaren Spielfeld (D-013, D-034).
- CONFIRMED: Gegner wählen zufällig zwischen Lokomotive und Wagon als Ziel, unabhängig von ihrer Spawnposition (D-039, D-014). Die Wahl erfolgt bereits während der Bewegung.
- CONFIRMED: Vollständig zerstörte Zugteile sind keine gültigen Gegnerziele, auch nicht während ihrer Reparatur (D-039).
- CONFIRMED: Gegner bewegen sich auf ihr Ziel zu, möglichst auf dem kürzesten Weg. Das Verhalten ist bewusst einfach und zombieartig, ohne Ausweichverhalten (D-040).
- CONFIRMED: Die Geschwindigkeit ist zu Beginn eher niedrig, konkrete Werte werden getestet (D-038).
- CONFIRMED: Erreicht ein Gegner sein Zugziel, verursacht er dort Schaden und despawnt (D-015).
- CONFIRMED: Der Spieler muss nicht jeden Gegner besiegen, bevor er den Zug erreicht (D-016).
- CONFIRMED: Gegner blockieren oder beeinflussen den Spieler nicht (D-035).
- CONFIRMED: Die Gesamtzahl der Gegner wird festgelegt und kann je Schwierigkeitsgrad variieren (D-031). Die Schwierigkeit entsteht hauptsächlich durch Anzahl und Masse (D-038).

## Offen

- OPEN (Tuning): Lebenspunkte, Tempo, Schaden des Gegners (Q-004). Anzahl, Spawnintervalle, Gruppen (Q-001 bis Q-003).
- OPEN: Details der Zielwahl: Wahrscheinlichkeiten, Zielpunkt am Zugteil, Neuwahl bei Zerstörung des Ziels unterwegs (Q-023).
- OPEN: Zählung durchgebrochener Gegner für den Sieg (Q-024).
- OPEN: Hindernisse im Spielfeld (Q-011). Ohne definierte Hindernisse entspricht „kürzester Weg“ der Geraden.

## Anforderungen

### REQ-ENM-001 – Spawn oberhalb, nicht im sichtbaren Feld
- **Problemstellung:** Gegner dürfen nicht „aus dem Nichts“ im sichtbaren Spielfeld erscheinen.
- **Ziel:** Spawn auf der Gegenseite des Zuges (oben) und Eintritt ins Spielfeld durch Bewegung.
- **Gewünschtes Verhalten:** Spawnpositionen liegen oberhalb, auf der dem Zug gegenüberliegenden Seite. Sie dürfen außerhalb des sichtbaren Bereichs liegen. Von dort laufen die Gegner ins Spielfeld.
- **Akzeptanzkriterien:** (1) Jede Spawnposition liegt auf der Gegenseite des Zuges (oben). (2) Keine Spawnposition liegt innerhalb des sichtbaren Spielfeldbereichs. (3) Ein gespawnter Gegner bewegt sich ab dem ersten Tick auf sein Ziel zu. (4) Spawnpositionen kommen aus Konfiguration.
- **Testfälle:** auto: Viele Spawns mit Testkonfiguration (Testdaten), Prüfung gegen sichtbares Rechteck und Zugseite. manuell: Greybox-Lauf, Gegner treten von oben ein.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-001), Q-011.
- **Entscheidungsstatus:** CONFIRMED (D-013, D-034); OPEN (Werte).

### REQ-ENM-002 – Zufällige Zielwahl zwischen Lokomotive und Wagon
- **Problemstellung:** Das Ziel soll unabhängig vom Spawnort feststehen.
- **Ziel:** Jeder Gegner hat ein Zugziel (Lokomotive oder Wagon), zufällig gewählt, schon während der Bewegung.
- **Gewünschtes Verhalten:** Die Wahl ist zufällig, nutzt die Spawnposition nicht als Eingabe und erfolgt bereits unterwegs. Mögliche Ziele sind nur gültige Zugteile (REQ-ENM-006).
- **Akzeptanzkriterien:** (1) Jeder aktive Gegner hat spätestens während der Bewegung ein Zugziel. (2) Das Ziel ist stets Lokomotive oder Wagon. (3) Die Spawnposition geht nicht in die Wahl ein. (4) Die Zufallsquelle ist austauschbar (für deterministische Tests). (5) Die Verteilung der Wahrscheinlichkeiten ist Konfiguration. Sie ist nicht festgelegt (Q-023).
- **Testfälle:** auto: Mit festem Seed liefern unterschiedliche Spawnpositionen dieselben Wahlen. auto: Bei vielen Gegnern werden beide Zugteile gewählt. auto: Ziele sind nie etwas anderes als Zugteile.
- **Abhängigkeiten:** train-and-defense, Q-023.
- **Entscheidungsstatus:** CONFIRMED (D-039, D-014); OPEN (Wahrscheinlichkeiten, Zielpunkt, Neuwahl).

### REQ-ENM-003 – Schaden am Ziel und Despawn
- **Problemstellung:** Gegner müssen Schaden am Zug verursachen und danach verschwinden.
- **Ziel:** Ankunft am Zugziel → Schaden → Despawn.
- **Gewünschtes Verhalten:** Beim Erreichen des Zugziels wird einmalig Schaden am gewählten Zugteil angewendet, danach wird der Gegner entfernt.
- **Akzeptanzkriterien:** (1) Bei Erreichen wird genau einmal Schaden angewendet. (2) Direkt danach existiert der Gegner nicht mehr. (3) Die Schadenshöhe stammt aus der Gegnerkonfiguration. (4) Kein weiterer Schaden von diesem Gegner danach. (5) Der Durchbruch wird für die Rundenstatistik gezählt.
- **Testfälle:** auto: Gegner an Zielposition → Zugteil um konfigurierten Schaden verringert, Gegner entfernt, Zähler „Zug erreicht“ + 1. Zweiter Tick: keine weitere Veränderung.
- **Abhängigkeiten:** train-and-defense (REQ-TRN-004), balance-and-statistics (REQ-STA-001), Q-004.
- **Entscheidungsstatus:** CONFIRMED (D-015); OPEN (Schadenshöhe).

### REQ-ENM-004 – Zug auch ohne Spieler-Eingriff erreichbar
- **Problemstellung:** Gegner müssen nicht erst besiegt werden, damit sie Schaden verursachen.
- **Ziel:** Gegner erreichen den Zug auch ohne Eingriff.
- **Gewünschtes Verhalten:** Ohne Angriff durch Spieler oder Geschütz erreichen Gegner ihr Ziel und verursachen Schaden.
- **Akzeptanzkriterien:** In einer Simulation ohne Verteidigung erreicht jeder Gegner sein Ziel und verursacht Schaden, solange Ziele gültig sind.
- **Testfälle:** auto: Simulation mit deaktivierten Angriffen.
- **Abhängigkeiten:** REQ-ENM-003.
- **Entscheidungsstatus:** CONFIRMED (D-016).

### REQ-ENM-005 – Einfache zombieartige Bewegung
- **Problemstellung:** Das Bewegungsverhalten muss bewusst einfach, vorhersagbar und testbar sein.
- **Ziel:** Gegner laufen direkt auf ihr Ziel zu.
- **Gewünschtes Verhalten:** Der Gegner bewegt sich mit konstanter Geschwindigkeit entlang des möglichst kürzesten Weges zu seinem Zugziel. Kein Ausweichen vor Spieler, Geschossen oder anderen Gegnern. Kein Blockieren des Spielers. Zu Beginn ist die Geschwindigkeit eher niedrig. Der Wert wird getestet.
- **Akzeptanzkriterien:** (1) Der zurückgelegte Weg entspricht dem kürzesten Weg zum Ziel (ohne definierte Hindernisse: gerade Linie). (2) Die Geschwindigkeit ist ein konfigurierbarer Wert pro Gegnertyp. (3) Es gibt keine Logik, die Gegner abhängig von Spieler- oder Gegnerpositionen ablenkt. (4) Gegner können sich überlappen. Das ist nicht ausdrücklich festgelegt, folgt aber aus „kein Ausweichverhalten“ und wird hier als zu bestätigende Auslegung geführt (OPEN, Q-011).
- **Testfälle:** auto: Gegner von Position A zu Ziel B erreicht B nach Weglänge/v Sekunden, Pfad ist eine Gerade. auto: Spieler oder anderer Gegner im Weg ändert die Bahn nicht.
- **Abhängigkeiten:** REQ-ENM-002, Q-004 (Tempo), Q-011.
- **Entscheidungsstatus:** CONFIRMED (D-040, D-038); OPEN (Tempo, Hindernisse).

### REQ-ENM-006 – Nur gültige Ziele
- **Problemstellung:** Zerstörte Zugteile dürfen nicht mehr angegriffen werden.
- **Ziel:** Die Zielwahl schließt vollständig zerstörte Zugteile aus, auch während ihrer Reparatur.
- **Gewünschtes Verhalten:** Gültig sind Zugteile, die nicht vollständig zerstört sind. Ein zerstörtes Teil wird erst nach vollständigem Abschluss der Reparatur wieder gültig.
- **Akzeptanzkriterien:** (1) Zerstörtes Teil ist nie ein gewähltes Ziel. (2) Gilt auch bei laufender Reparatur. (3) Wiederhergestelltes Teil ist wieder wählbar. (4) Das Verhalten, wenn ein Ziel während der Bewegung zerstört wird, ist nicht festgelegt (Q-023) und wird nicht eigenmächtig entschieden.
- **Testfälle:** auto: Lokomotive zerstört → neue Wahl liefert nur den Wagon. Wagon zerstört und in Reparatur (50 %) → nur die Lokomotive. Wagon repariert → beide wählbar.
- **Abhängigkeiten:** train-and-defense, repair-system (REQ-REP-006), Q-023.
- **Entscheidungsstatus:** CONFIRMED (D-039); OPEN (Neuwahl).

### REQ-ENM-007 – Genau ein Gegnertyp
- **Problemstellung:** Umfang des Prototyps begrenzen.
- **Ziel:** Ein einziger Gegnertyp mit konfigurierbaren Werten, erweiterbar durch weitere Typen mit eigener Geschwindigkeit.
- **Gewünschtes Verhalten:** Alle Gegner der Runde haben denselben Typ. Werte (Lebenspunkte, Tempo, Schaden) stehen in der Typkonfiguration.
- **Akzeptanzkriterien:** (1) Es existiert genau ein Typ im Prototyp. (2) Gegnerwerte sind Konfiguration je Typ, nicht fest im Code. (3) Eine spätere Typerweiterung erfordert keine Änderung der Bewegungs- oder Zielwahlregeln (Struktur erlaubt unterschiedliche Geschwindigkeiten pro Typ).
- **Testfälle:** auto: Wellenplan erzeugt nur Gegner des einen Typs. auto: Zweiter Test-Typ mit anderer Geschwindigkeit bewegt sich entsprechend (nur als Testdaten).
- **Abhängigkeiten:** Q-004.
- **Entscheidungsstatus:** CONFIRMED (D-038).
