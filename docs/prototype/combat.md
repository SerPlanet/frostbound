# Kampf und automatische Angriffe

**Zweck:** Beschreibt die zwei unabhängigen automatischen Angriffsquellen (Spielerangriff, Zuggeschütz) sowie Treffer, Schaden und Besiegen von Gegnern.
**Zielgruppe:** Gameplay-Agent Kampf.
**Abhängigkeiten:** [player.md](player.md), [enemies.md](enemies.md); Architektur: [../technical/architecture.md](../technical/architecture.md); Statistik: [balance-and-statistics.md](balance-and-statistics.md).

## Bestätigte Regeln

- CONFIRMED: Zwei voneinander unabhängige automatische Angriffsquellen (D-030). Es gibt keine manuelle Angriffstaste.
- CONFIRMED Spielerangriff: Zu Beginn stark begrenzte Reichweite. Greift automatisch den **nächsten Gegner innerhalb seiner Reichweite** an. Im Prototyp Single Target. Flächenangriffe und Mehrfachziele sind spätere Möglichkeiten (D-036, D-008).
- CONFIRMED Zuggeschütz: Greift automatisch an, hat das **gesamte Spielfeld** als Reichweite und sucht das nächste geeignete Ziel (D-037, D-009).
- CONFIRMED: Überhitzung ist im ersten Prototyp nicht implementiert (D-010).

## Offen

- OPEN (Tuning): Reichweitenwert des Spielers, Schaden, Feuerraten (Q-005, Q-004).
- OPEN: Bedeutung von „geeignet“ für das Geschütz. Bezugspunkt für „nächstes“ bei Vollfeldreichweite (Q-005).
- OPEN: Anzahl, Montageort, Lebenspunkte der Geschütze (Q-025).
- OPEN: Trefferart: Projektil oder Soforttreffer (Q-028).

## Anforderungen

### REQ-CMB-001 – Zwei unabhängige automatische Angriffsquellen
- **Problemstellung:** Angreifen soll keine Eingabe erfordern, und Spieler und Zuggeschütz sollen je einen eigenen Angriff besitzen.
- **Ziel:** Spielerangriff und Geschützangriff laufen automatisch und unabhängig.
- **Gewünschtes Verhalten:** Beide Quellen haben eigenen Zustand und eigene Konfiguration und lösen ohne Taste oder Klick Angriffe aus, sobald ein gültiges Ziel in ihrer Reichweite ist.
- **Akzeptanzkriterien:** (1) Es existieren genau diese zwei Angriffsquellen. (2) Es existiert keine Eingabe zum Auslösen eines Angriffs. (3) Ist die eine Quelle deaktiviert, feuert die andere unverändert weiter. (4) Jede Quelle hat eigene Konfiguration für Reichweite, Feuerrate und Schaden und teilt keinen Zustand (Abklingzeit, Zielwahl) mit der anderen. (5) Ohne gültiges Ziel in Reichweite greift die Quelle nicht an.
- **Testfälle:** auto: Nur Spieler aktiv → nur dieser feuert. Nur Geschütz aktiv → nur dieses feuert. Beide aktiv → beide feuern, Abklingzeiten beeinflussen sich nicht. Ziel in Reichweite → Angriff ohne Eingabe. Kein Ziel → kein Angriff.
- **Abhängigkeiten:** Q-004, Q-005.
- **Entscheidungsstatus:** CONFIRMED (D-008, D-030); OPEN (Werte).

### REQ-CMB-002 – Zuggeschütz: gesamtes Spielfeld, nächstes geeignetes Ziel
- **Problemstellung:** Das Geschütz soll deterministisch ein Ziel wählen.
- **Ziel:** Auswahl des nächsten geeigneten Ziels im gesamten Spielfeld.
- **Gewünschtes Verhalten:** Das Geschütz kann jeden Gegner im gesamten Spielfeld angreifen (keine Reichweitenbegrenzung innerhalb des Spielfelds). Unter den geeigneten Gegnern wird der nächstgelegene gewählt. Die Eignungsregel und der Bezugspunkt der Entfernung sind austauschbar gekapselt.
- **Akzeptanzkriterien:** (1) Jeder Gegner im Spielfeld ist unabhängig von der Entfernung als Ziel möglich, sofern geeignet. (2) Bei mehreren geeigneten Gegnern wird der mit dem kleinsten Abstand zum Bezugspunkt gewählt. (3) Ungeeignete Gegner werden nicht gewählt. (4) Eignungsregel und Bezugspunkt sind austauschbar. Der Standard ist bis zur Entscheidung nicht festgelegt, Tests definieren sie ausdrücklich selbst. (5) Das Geschütz greift nur an, wenn es funktionsfähig ist (nicht zerstört, nicht auf einem zerstörten Wagon; Details Q-025).
- **Testfälle:** auto: Gegner an definierten Positionen, Testregel „alle geeignet“ → der nächste wird gewählt, auch bei großer Entfernung. Testregel schließt einen aus → dieser wird nie gewählt.
- **Abhängigkeiten:** Q-005, Q-025.
- **Entscheidungsstatus:** CONFIRMED (D-037, D-009); OPEN („geeignet“, Bezugspunkt).

### REQ-CMB-003 – Keine Überhitzung
- **Problemstellung:** Überhitzung gehört nicht in den Prototyp.
- **Ziel:** Kein Überhitzungssystem.
- **Gewünschtes Verhalten:** Das Geschütz kennt keinen Hitzezustand.
- **Akzeptanzkriterien:** Es gibt keinen Hitzewert, keine Hitzeanzeige und keine Abschaltung wegen Hitze.
- **Testfälle:** Code-Review und manuell: keine Hitze-Logik.
- **Abhängigkeiten:** –
- **Entscheidungsstatus:** CONFIRMED (D-010).

### REQ-CMB-004 – Spielerangriff: nächster Gegner in Reichweite, Single Target
- **Problemstellung:** Das Verhalten des Spielerangriffs muss eindeutig sein.
- **Ziel:** Der Spieler greift automatisch den nächsten Gegner in seiner begrenzten Reichweite an.
- **Gewünschtes Verhalten:** Befindet sich mindestens ein Gegner innerhalb der Spielerreichweite, wird der dem Spieler nächste Gegner angegriffen. Pro Angriff gibt es genau ein Ziel. Die Reichweite ist zu Beginn stark begrenzt.
- **Akzeptanzkriterien:** (1) Es wird nur ein Gegner pro Angriff getroffen (Single Target). (2) Es wird nur angegriffen, wenn ein Gegner im Abstand ≤ Reichweite ist. (3) Bei mehreren Gegnern in Reichweite wird der mit dem kleinsten Abstand zum Spieler gewählt. (4) Die Reichweite ist Konfiguration mit Startwert „klein im Verhältnis zum Spielfeld“, der Zahlenwert ist OPEN. (5) Es gibt keine Flächen- oder Mehrfachzielwirkung.
- **Testfälle:** auto: Gegner bei Abstand r_p−ε → wird angegriffen. Bei r_p+ε → nicht. Drei Gegner in Reichweite → nur der nächste verliert Lebenspunkte. Zwei gleich weit entfernte Gegner: Ergebnis ist deterministisch (feste Tie-Break-Regel, nicht festgelegt, Test definiert eine).
- **Abhängigkeiten:** player, Q-005 (Wert), Q-028.
- **Entscheidungsstatus:** CONFIRMED (D-036); OPEN (Reichweitenwert, Tie-Break).

### REQ-CMB-005 – Treffer, Schaden und Besiegen von Gegnern
- **Problemstellung:** Gegner müssen durch die Angriffsquellen ausgeschaltet werden können, und es muss feststehen, wer sie besiegt hat.
- **Ziel:** Ein nachvollziehbares Modell für Treffer, Schaden und Besiegen.
- **Gewünschtes Verhalten:** Ein Angriff, der trifft, fügt dem Ziel Schaden zu. Erreicht der Gegner den Besiegt-Zustand, wird er entfernt und der Quelle zugeordnet, deren Treffer ihn besiegt hat. Besiegte Gegner verursachen keinen Schaden am Zug.
- **Akzeptanzkriterien:** (1) Ein getroffener Gegner verliert die konfigurierte Schadensmenge. (2) Ein besiegter Gegner wird sofort entfernt, richtet keinen Zugschaden mehr an und ist kein weiteres Ziel. (3) Kills werden Spieler oder Geschütz zugeordnet (PROPOSED: Quelle des letzten Treffers). (4) Ein Gegner wird höchstens einmal besiegt. (5) Zwei Quellen treffen denselben Gegner im selben Tick: Der Ausgang ist deterministisch (feste Reihenfolge, Testdaten definieren sie).
- **Modellannahme (PROPOSED):** Gegner haben Lebenspunkte, und ein Gegner gilt bei 0 Lebenspunkten als besiegt. Das ist ein Vorschlag. „Besiegen“ ist bestätigt (D-016, D-044), das Lebenspunktemodell nicht. Die Trefferart (Projektil oder Soforttreffer) ist OPEN (Q-028).
- **Testfälle:** auto: Gegner mit h Lebenspunkten, Treffer d → h−d. Bei 0 → entfernt, Kill-Zähler der Quelle + 1. Entfernt → kein Zugschaden. Gleichzeitige Treffer → genau ein Kill.
- **Abhängigkeiten:** enemies, balance-and-statistics (REQ-STA-001), Q-004, Q-028.
- **Entscheidungsstatus:** CONFIRMED (Besiegen als Konzept); PROPOSED (Lebenspunktemodell, Zuordnung); OPEN (Trefferart).

## Menschliche Bewertung

Wie sich Treffer, Schüsse und Abwehr „anfühlen“, bewertet der Projektverantwortliche.
