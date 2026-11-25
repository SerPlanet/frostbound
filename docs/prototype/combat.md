# Kampf und automatische Angriffe

**Zweck:** Beschreibt die zwei unabhängigen automatischen Angriffsquellen (Spielerangriff, Zuggeschütz) sowie Treffer, Schaden und Besiegen von Gegnern.
**Zielgruppe:** Gameplay-Agent Kampf.
**Abhängigkeiten:** [player.md](player.md), [enemies.md](enemies.md); Architektur: [../technical/architecture.md](../technical/architecture.md); Statistik: [balance-and-statistics.md](balance-and-statistics.md).

## Bestätigte Regeln

- CONFIRMED: Zwei voneinander unabhängige automatische Angriffsquellen (D-030). Es gibt keine manuelle Angriffstaste.
- CONFIRMED Spielerangriff: Zu Beginn stark begrenzte Reichweite. Greift automatisch den **nächsten Gegner innerhalb seiner Reichweite** an. Im Prototyp Einzelziel. Flächenangriffe und Mehrfachziele sind spätere Möglichkeiten (D-036, D-008). Der Angriff läuft auch während der Reparatur weiter (D-056).
- CONFIRMED Zuggeschütz: Greift automatisch an, hat das **gesamte Spielfeld** als Reichweite und wählt den nächsten geeigneten Gegner (D-037, D-009). Es befindet sich auf dem Wagon und ist nur funktionsfähig, solange der Wagon nicht zerstört ist (D-054, D-055).
- CONFIRMED: Überhitzung ist im ersten Prototyp nicht implementiert (D-010).

## Offen

- TESTWERT: Reichweite des Spielerangriffs, Schaden und Feuerraten beider Quellen, Gegnerlebenspunkte (Q-005, Q-004).
- TECH (revidierbar): Was für das Geschütz „geeignet“ ist, Bezugspunkt für „nächstes“ Ziel (TECH-05), Soforttreffer statt Projektil (TECH-06). Siehe [../technical/architecture.md](../technical/architecture.md).

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
- **Problemstellung:** Das Geschütz soll deterministisch ein Ziel wählen und nur arbeiten, wenn es funktionsfähig ist.
- **Ziel:** Auswahl des nächsten geeigneten Ziels im gesamten Spielfeld.
- **Gewünschtes Verhalten:** Das Geschütz kann jeden geeigneten Gegner im gesamten Spielfeld angreifen und wählt den nächstgelegenen. Es greift nur an, solange es funktionsfähig ist (der Wagon ist nicht zerstört).
- **Akzeptanzkriterien:** (1) Kein Entfernungslimit innerhalb des Spielfeldes. (2) Unter den geeigneten Gegnern wird der mit dem kleinsten Abstand zum Bezugspunkt gewählt. (3) Die Eignungsregel und der Bezugspunkt sind austauschbar gekapselt (Standard: TECH-05). (4) Ein zerstörter Wagon (und damit zerstörtes Geschütz) greift nicht an. (5) Es gibt nur ein Geschütz, ohne Überhitzung.
- **Testfälle:** auto: Gegner nahe und fern → der nähere wird gewählt, auch bei großer Entfernung. Gegner außerhalb des Spielfeldes → nicht geeignet. Wagon zerstört → kein Schuss. Wagon beschädigt, nicht zerstört → Schuss.
- **Abhängigkeiten:** train-and-defense (REQ-TRN-005), architecture (TECH-05).
- **Entscheidungsstatus:** CONFIRMED (D-037, D-009, D-055); TECH (Eignung, Bezugspunkt).

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
- **Abhängigkeiten:** player, architecture (Testwerte).
- **Entscheidungsstatus:** CONFIRMED (D-036); TESTWERT (Reichweite); TECH (Tie-Break nach Gegner-ID).

### REQ-CMB-005 – Treffer, Schaden und Besiegen von Gegnern
- **Problemstellung:** Gegner müssen durch die Angriffsquellen ausgeschaltet werden können, und es muss feststehen, wer sie besiegt hat.
- **Ziel:** Ein nachvollziehbares Modell für Treffer, Schaden und Besiegen.
- **Gewünschtes Verhalten:** Ein Angriff, der trifft, fügt dem Ziel Schaden zu. Erreicht der Gegner den Besiegt-Zustand, wird er entfernt und der Quelle zugeordnet, deren Treffer ihn besiegt hat. Besiegte Gegner verursachen keinen Schaden am Zug.
- **Akzeptanzkriterien:** (1) Ein getroffener Gegner verliert die konfigurierte Schadensmenge. (2) Ein besiegter Gegner wird sofort entfernt, richtet keinen Zugschaden mehr an und ist kein weiteres Ziel. (3) Kills werden Spieler oder Geschütz zugeordnet (TECH: Quelle des letzten Treffers). (4) Ein Gegner wird höchstens einmal besiegt. (5) Zwei Quellen treffen denselben Gegner im selben Tick: Der Ausgang ist deterministisch (feste Reihenfolge, Testdaten definieren sie).
- **Modellannahme (TECH):** Gegner haben Lebenspunkte, und ein Gegner gilt bei 0 Lebenspunkten als besiegt. Das ist ein Vorschlag. „Besiegen“ ist bestätigt (D-016, D-044), das Lebenspunktemodell nicht. Die Trefferart ist als Soforttreffer technisch festgelegt (TECH-06, revidierbar).
- **Testfälle:** auto: Gegner mit h Lebenspunkten, Treffer d → h−d. Bei 0 → entfernt, Kill-Zähler der Quelle + 1. Entfernt → kein Zugschaden. Gleichzeitige Treffer → genau ein Kill.
- **Abhängigkeiten:** enemies, balance-and-statistics (REQ-STA-001), architecture (TECH-06).
- **Entscheidungsstatus:** CONFIRMED (Besiegen als Konzept); TECH (Lebenspunktemodell, Zuordnung, Soforttreffer).

## Menschliche Bewertung

Wie sich Treffer, Schüsse und Abwehr „anfühlen“, bewertet der Projektverantwortliche.
