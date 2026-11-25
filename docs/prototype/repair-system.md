# Reparatursystem

**Zweck:** Beschreibt Reparaturzonen, die schrittweise automatische Reparatur, die Auswahl bei mehreren Objekten und die Wiederherstellung zerstörter Zugteile.
**Zielgruppe:** Gameplay-Agent Reparatur.
**Abhängigkeiten:** [train-and-defense.md](train-and-defense.md) (Zugteile), [player.md](player.md), [enemies.md](enemies.md) (gültige Ziele). Begriffe: [../project/glossary.md](../project/glossary.md).

## Bestätigte Regeln (D-043, D-056, D-055, D-041)

- CONFIRMED: Reparatur ist kostenlos.
- CONFIRMED: Die Reparatur erfolgt in Schritten von 5 HP. Alle 5 Sekunden werden 5 HP wiederhergestellt. Eine vollständige Reparatur von 0 auf 100 HP dauert 100 Sekunden. Die Geschwindigkeit ist ein vorläufiger Prototypwert.
- CONFIRMED: Der Spieler muss sich in der Reparaturzone des jeweiligen Zugteils befinden und kann sich darin frei bewegen. Verlässt er die Zone, pausiert die Reparatur, der bisherige Fortschritt bleibt erhalten, und der Spieler kann später genau dort weitermachen.
- CONFIRMED: Die Reparatur erfolgt automatisch, ohne zusätzliche Taste. Der Spieler greift währenddessen weiterhin automatisch an.
- CONFIRMED: Es kann immer nur ein Zugobjekt gleichzeitig repariert werden.
- CONFIRMED: Die Zonen müssen klar erkennbar sein. Die Form ist nicht vorgeschrieben (z. B. rechteckig oder rund).
- CONFIRMED: Eine Zone wird erst angezeigt, wenn das zugehörige Objekt repariert werden kann. Alle aktuell reparierbaren Objekte zeigen ihre Zone gleichzeitig an, auch wenn der Spieler gerade ein anderes Objekt repariert.
- CONFIRMED: Die Mechanik gilt für Lokomotive und Wagon. Die separate Geschützreparatur ist im Prototyp nicht erforderlich.
- CONFIRMED: Die Reparatur des zerstörten Wagons stellt Wagon und Geschütz gemeinsam wieder her (Geschütz 20/20). Ein zerstörtes Teil ist auch während der Reparatur kein gültiges Gegnerziel und bleibt bis zum Abschluss zerstört (D-039, D-041).
- CONFIRMED (für die Vollversion, im Prototyp nicht anwendbar): Prioritätsregeln bei überlappenden Bereichen. Ein Geschütz hat Vorrang vor seinem intakten Wagon. Ist der Wagon vollständig zerstört, hat er Vorrang vor seinen montierten Geschützen. Ein Geschütz auf intaktem Wagon ist separat reparierbar (D-043). Im Prototyp gibt es keine separate Geschützreparatur.

## Offen

Keine Gameplay-Fragen. Technische Festlegungen zu Form, Größe und Lage der Zonen: [../technical/architecture.md](../technical/architecture.md) (TECH-09, revidierbar).

## Anforderungen

### REQ-REP-001 – Reparatur ist kostenlos
- **Problemstellung:** Agenten könnten Kosten ergänzen.
- **Ziel:** Reparatur verbraucht nichts.
- **Gewünschtes Verhalten:** Der Fortschritt hängt nur von Anwesenheit und Zeit ab.
- **Akzeptanzkriterien:** (1) Der Reparaturcode enthält keinen Ressourcenverbrauch. (2) Eine Reparatur ist ohne jeden Besitz einer Ressource vollständig möglich.
- **Testfälle:** auto: Reparatur läuft ohne Ressourcenzustand bis zum Abschluss.
- **Abhängigkeiten:** resources.
- **Entscheidungsstatus:** CONFIRMED (D-043, D-056).

### REQ-REP-002 – Reparaturzonen: erkennbar, nur bei Bedarf, gleichzeitig
- **Problemstellung:** Der Spieler muss erkennen, was repariert werden kann und wo er stehen muss.
- **Ziel:** Je Zugteil eine Zone, sichtbar, wenn das Teil repariert werden kann.
- **Gewünschtes Verhalten:** Lokomotive und Wagon haben je eine Zone. Eine Zone wird angezeigt, solange ihr Objekt reparierbar ist (Lebenspunkte unter dem Maximum oder zerstört). Alle reparierbaren Objekte zeigen ihre Zone gleichzeitig. Ist ein Objekt voll intakt (volle Lebenspunkte), wird keine Zone angezeigt.
- **Akzeptanzkriterien:** (1) Pro Zugteil existiert genau eine Zone. (2) Die Zone ist angezeigt ⇔ das Objekt reparierbar ist. (3) Mehrere reparierbare Objekte zeigen ihre Zonen zugleich, auch während der Spieler eines repariert. (4) Die Zone eines zerstörten Objekts besteht und wird angezeigt. (5) Zonen sind von Spielfeld und voneinander visuell unterscheidbar. (6) Form und Größe kommen aus Konfiguration.
- **Testfälle:** auto: Lokomotive 100/100 → Zone nicht angezeigt. 90/100 → angezeigt. Wagon zerstört → angezeigt. Beide beschädigt → beide angezeigt, auch bei Reparatur des einen. manuell: Greybox, Zonen klar erkennbar. menschl. Bewertung: ob „klar erkennbar“ ausreichend ist, beurteilt der Projektverantwortliche.
- **Abhängigkeiten:** train-and-defense, testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-043, D-056).

### REQ-REP-003 – Schrittweise automatische Reparatur mit Pausenfortschritt
- **Problemstellung:** Reparatur soll ohne Eingabe funktionieren, in festen Schritten, mit erhaltenem Fortschritt.
- **Ziel:** 5 HP alle 5 Sekunden, nur bei Anwesenheit, Fortschritt bleibt erhalten.
- **Gewünschtes Verhalten:** Befindet sich der Spieler in der Zone eines reparierbaren Objekts und wird dieses repariert (REQ-REP-004), läuft ein Fortschrittszähler dieses Objekts. Alle 5 Sekunden angesammelter Reparaturzeit werden 5 HP hinzugefügt. Verlässt der Spieler die Zone, hört der Zähler auf, sein Stand bleibt erhalten. Bei Rückkehr geht es vom erhaltenen Stand weiter. Der Spieler kann sich in der Zone frei bewegen und greift währenddessen automatisch an.
- **Akzeptanzkriterien:** (1) Keine Taste nötig. (2) 5 HP je 5 Sekunden Aufenthalt, nicht kontinuierlich (Schritte). (3) Von 0 auf 100 HP sind 100 Sekunden Aufenthalt nötig (20 Schritte). (4) Verlassen der Zone pausiert, der Zählerstand bleibt. (5) Jedes Objekt hat seinen eigenen Zählerstand. (6) Die Lebenspunkte überschreiten das Maximum nicht. (7) Werte (5 HP, 5 s) stehen in der Konfiguration. (8) Der automatische Angriff des Spielers ist während der Reparatur nicht deaktiviert.
- **Testfälle:** auto: 4,9 s in der Zone → +0 HP. 5,0 s → +5 HP. 3 s, Zone verlassen, 10 s außerhalb, 2 s zurück → +5 HP (Zähler 3 + 2). 100 s → 100 HP. Objekt A teilweise repariert, Objekt B repariert: Zähler A unverändert. Spieler greift während der Reparatur Gegner an.
- **Abhängigkeiten:** player, combat, REQ-REP-004.
- **Entscheidungsstatus:** CONFIRMED (D-056).

### REQ-REP-004 – Nur ein Objekt gleichzeitig
- **Problemstellung:** Es darf nie mehr als ein Objekt zugleich repariert werden.
- **Ziel:** Genau ein Objekt wird zur selben Zeit repariert.
- **Gewünschtes Verhalten:** Stehen mehrere Zonen im Spielerbereich, wird nur ein Objekt repariert. Im Prototyp überlappen die Zonen von Lokomotive und Wagon nicht (technische Festlegung, TECH-09), sodass der Spieler zu jedem Zeitpunkt höchstens in einer Zone steht. Sollte eine Konfiguration dennoch überlappen, wird deterministisch das erste Objekt in der Reihenfolge Wagon, Lokomotive gewählt (TECH, keine Gameplay-Regel). Die bestätigten Vorrangregeln zwischen Geschütz und Wagon gelten für die Vollversion und sind im Prototyp nicht anwendbar.
- **Akzeptanzkriterien:** (1) In keinem Schritt wächst der Zähler oder die Lebenspunkte von mehr als einem Objekt. (2) Die Prototypkonfiguration enthält keine überlappenden Zonen. (3) Bei überlappender Testkonfiguration gilt die genannte Reihenfolge.
- **Testfälle:** auto: Spieler in einer Zone → nur dieses Objekt repariert. Testkonfiguration mit überlappenden Zonen → genau ein Objekt. Konfigurationsprüfung: keine Überlappung in der Prototypkonfiguration.
- **Abhängigkeiten:** architecture (TECH-09).
- **Entscheidungsstatus:** CONFIRMED (Ein-Objekt-Regel, D-043, D-056); TECH (Ausgestaltung im Prototyp).

### REQ-REP-005 – Wiederherstellung zerstörter Teile
- **Problemstellung:** Funktion und Wiederherstellung müssen eindeutig definiert sein.
- **Ziel:** Ein zerstörtes Teil erlangt Intaktheit und Funktion erst mit vollständigem Reparaturabschluss.
- **Gewünschtes Verhalten:** Die Lebenspunkte eines zerstörten Teils steigen schrittweise, der Status „zerstört“ bleibt. Erreichen sie das Maximum, endet der Status „zerstört“, das Teil ist wieder intakt und ein gültiges Gegnerziel. Bei der Wagon-Reparatur wird zugleich das Geschütz funktionsfähig und auf 20/20 HP gesetzt.
- **Akzeptanzkriterien:** (1) Bis zum Abschluss bleibt der Status „zerstört“, das Teil ist kein gültiges Ziel. (2) Im Schritt des Abschlusses ist das Teil intakt. (3) Bei Abschluss der Wagon-Reparatur ist das Geschütz funktionsfähig mit 20/20 HP, unabhängig von seinem früheren Zustand. (4) Wird die Reparatur unterbrochen, bleibt alles zerstört.
- **Testfälle:** auto: Wagon zerstört, repariert bis 95 → zerstört, Geschütz funktionslos. Bis 100 → intakt, Geschütz funktionsfähig 20/20. Lokomotive: Abschluss → intakt, keine Zusatzwirkung.
- **Abhängigkeiten:** train-and-defense (REQ-TRN-003, REQ-TRN-005), enemies (REQ-ENM-006).
- **Entscheidungsstatus:** CONFIRMED (D-041, D-055, D-039).

### REQ-REP-006 – Zerstörte Teile sind keine Gegnerziele
- **Problemstellung:** Gegner dürfen kein zerstörtes Teil angreifen, auch nicht in Reparatur.
- **Ziel:** Konsistenz zwischen Reparatur und Zielwahl.
- **Gewünschtes Verhalten:** Ein zerstörtes Teil ist bis zum Reparaturabschluss kein gültiges Ziel.
- **Akzeptanzkriterien:** (1) Die Zielwahl schließt zerstörte Teile aus, auch bei laufender Reparatur. (2) Nach Abschluss ist das Teil wieder wählbar.
- **Testfälle:** auto: Teil zerstört, Reparatur bei 50 → wird nie gewählt. Nach Abschluss wählbar.
- **Abhängigkeiten:** enemies (REQ-ENM-002, REQ-ENM-006).
- **Entscheidungsstatus:** CONFIRMED (D-039).
