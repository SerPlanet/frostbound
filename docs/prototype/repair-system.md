# Reparatursystem

**Zweck:** Beschreibt Reparaturbereiche, automatische Reparatur, Prioritäten bei überlappenden Bereichen und die Wiederherstellung zerstörter Zugteile und Geschütze.
**Zielgruppe:** Gameplay-Agent Reparatur.
**Abhängigkeiten:** [train-and-defense.md](train-and-defense.md) (Zugteile, Lebenspunkte), [player.md](player.md) (Nähe-Prinzip), [enemies.md](enemies.md) (gültige Ziele). Begriffe: [../project/glossary.md](../project/glossary.md).

## Bestätigte Regeln (D-043, D-041, D-020)

- CONFIRMED: Reparaturen kosten keine Ressourcen. (Baukosten sind davon unberührt und bleiben OPEN, Q-010.)
- CONFIRMED: Jeder reparierbare Gegenstand besitzt einen eigenen **Reparaturbereich**. Die Bereiche müssen visuell eindeutig erkennbar sein.
- CONFIRMED: Der Spieler muss sich im entsprechenden Bereich aufhalten. Die Reparatur erfolgt automatisch, ohne zusätzliche Taste.
- CONFIRMED: Verlässt der Spieler den Bereich, pausiert der Reparaturfortschritt.
- CONFIRMED: Es kann immer nur ein Objekt gleichzeitig repariert werden.
- CONFIRMED: Überlappen Reparaturbereiche, entscheidet eine Prioritätsregel. Bestätigt sind:
  1. Ein Geschütz hat Vorrang vor seinem intakten Wagon.
  2. Ist der Wagon vollständig zerstört, hat der Wagon Vorrang vor seinen montierten Geschützen.
- CONFIRMED: Wird ein zerstörter Wagon vollständig repariert, werden auch alle darauf montierten Geschütze vollständig wiederhergestellt.
- CONFIRMED: Ein zerstörtes Geschütz auf einem intakten Wagon kann separat repariert werden.
- CONFIRMED: Reparaturbereiche bleiben auch bei vollständig zerstörten Objekten vorhanden.
- CONFIRMED: Die Funktion eines zerstörten Wagons wird erst nach vollständigem Abschluss der Reparatur wiederhergestellt. Während der Reparatur ist er kein gültiges Gegnerziel (D-039).

## Offen

- OPEN: Form, Größe, Lage und Darstellung der Reparaturbereiche; Priorität bei Überlappung zwischen anderen Objekten (z. B. Lokomotive und Wagon); Auslegung von „intakt“ (hier gelesen als: nicht vollständig zerstört, Q-026).
- OPEN: Wie die Reparatur bei nur beschädigten (nicht zerstörten) Objekten wirkt (Q-027).
- OPEN: Reparaturgeschwindigkeit, Wert (Q-009, Tuning).
- OPEN: Anzahl, Montageort und Zerstörungsmechanik der Geschütze (Q-025).

## Anforderungen

### REQ-REP-001 – Reparaturen sind kostenlos
- **Problemstellung:** Agenten könnten Ressourcenkosten ergänzen.
- **Ziel:** Reparatur verbraucht nichts.
- **Gewünschtes Verhalten:** Reparaturfortschritt hängt nur von Anwesenheit und Zeit ab.
- **Akzeptanzkriterien:** (1) Der Reparaturcode enthält keinen Ressourcenverbrauch. (2) Eine Reparatur ist ohne jeden Besitz irgendeiner Ressource vollständig möglich.
- **Testfälle:** auto: Reparatur ohne Ressourcenstand läuft bis zum Abschluss.
- **Abhängigkeiten:** resources.
- **Entscheidungsstatus:** CONFIRMED (D-043).

### REQ-REP-002 – Eigener Reparaturbereich je reparierbarem Objekt
- **Problemstellung:** Der Spieler muss erkennen und festlegen können, welches Objekt er repariert.
- **Ziel:** Jedes reparierbare Objekt (Lokomotive, Wagon, Geschütz) hat einen eigenen, sichtbaren Reparaturbereich.
- **Gewünschtes Verhalten:** Bereiche sind in der Greybox visuell klar erkennbar und dem Objekt zuordenbar. Sie bleiben bei vollständig zerstörten Objekten bestehen.
- **Akzeptanzkriterien:** (1) Jedes reparierbare Objekt besitzt genau einen Reparaturbereich. (2) Der Bereich existiert unabhängig vom Zerstörungszustand des Objekts. (3) Jeder Bereich ist in der Darstellung sichtbar und vom Spielfeld und von anderen Bereichen unterscheidbar. (4) Form und Größe kommen aus Konfiguration.
- **Testfälle:** auto: Für jedes Objekt existiert ein Bereich, auch nach Zerstörung des Objekts. manuell: Greybox-Lauf, alle Bereiche sind sichtbar und zuordenbar. menschl. Bewertung: ob die Erkennbarkeit „eindeutig“ genug ist, bewertet der Projektverantwortliche.
- **Abhängigkeiten:** Q-026 (Form, Größe, Lage), testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-043); OPEN (Form, Größe, Lage).

### REQ-REP-003 – Automatische Reparatur mit pausierendem Fortschritt
- **Problemstellung:** Reparatur soll ohne Zusatzeingabe funktionieren und bei Abwesenheit pausieren.
- **Ziel:** Fortschritt nur bei Anwesenheit des Spielers im Bereich.
- **Gewünschtes Verhalten:** Solange der Spieler im Reparaturbereich des aktuell ausgewählten (prioritären) Objekts steht, schreitet der Fortschritt voran. Verlässt er den Bereich, bleibt der Fortschritt erhalten und steigt nicht weiter.
- **Akzeptanzkriterien:** (1) Keine Taste nötig. (2) Fortschritt steigt nur bei Anwesenheit. (3) Beim Verlassen bleibt der Fortschritt unverändert. (4) Bei Rückkehr geht es vom erreichten Stand weiter. (5) Die Geschwindigkeit ist Konfiguration.
- **Testfälle:** auto: im Bereich, Δt → Fortschritt steigt; außerhalb → unverändert; wieder im Bereich → setzt fort.
- **Abhängigkeiten:** player (REQ-PLR-003), Q-009, Q-027.
- **Entscheidungsstatus:** CONFIRMED (D-020, D-043); OPEN (Geschwindigkeit, Wirkung bei Beschädigung).

### REQ-REP-004 – Nur ein Objekt gleichzeitig, Prioritätsregeln
- **Problemstellung:** Überlappende Bereiche dürfen nicht mehrere Reparaturen gleichzeitig auslösen.
- **Ziel:** Genau ein Objekt wird zur selben Zeit repariert, die Auswahl folgt festen Regeln.
- **Gewünschtes Verhalten:** Steht der Spieler in mehreren Bereichen, wird nur das nach Priorität gewählte Objekt repariert. Bestätigte Regeln: (a) Geschütz vor seinem intakten Wagon, (b) vollständig zerstörter Wagon vor seinen montierten Geschützen. Die Prioritätsentscheidung ist als austauschbare Regel gekapselt, da weitere Fälle OPEN sind.
- **Akzeptanzkriterien:** (1) Zu keinem Zeitpunkt wächst der Fortschritt von mehr als einem Objekt. (2) Bereich von Geschütz und intaktem Wagon überlappt → Geschütz wird repariert (nur wenn es repariert werden muss). (3) Wagon zerstört, Bereiche überlappen → Wagon wird repariert, die Geschütze nicht. (4) Für nicht definierte Überlappungen gibt es keine fest verdrahtete Entscheidung ohne Freigabe: Der Standard ist bis zur Entscheidung ein dokumentierter, in Tests ausdrücklich definierter Platzhalter.
- **Testfälle:** auto: je ein Test für (a) und (b). auto: Spieler in drei überlappenden Bereichen, nur ein Fortschritt wächst. auto: Fortschritt eines nicht ausgewählten Objekts bleibt unverändert.
- **Abhängigkeiten:** Q-026, Q-025.
- **Entscheidungsstatus:** CONFIRMED (a), (b); OPEN (weitere Fälle).

### REQ-REP-005 – Wiederherstellung zerstörter Wagons und Geschütze
- **Problemstellung:** Funktion und Wiederherstellung müssen eindeutig definiert sein.
- **Ziel:** Zerstörte Objekte erlangen ihre Funktion erst nach vollständiger Reparatur zurück.
- **Gewünschtes Verhalten:** Ein zerstörter Wagon behält seinen Zustand „ohne Funktion“, bis der Reparaturfortschritt vollständig abgeschlossen ist. Mit Abschluss werden alle darauf montierten Geschütze vollständig wiederhergestellt. Ein zerstörtes Geschütz auf einem intakten Wagon wird separat repariert.
- **Akzeptanzkriterien:** (1) Während der Reparatur eines zerstörten Wagons ist seine Funktion nicht aktiv. (2) Im Moment des Reparaturabschlusses ist die Funktion aktiv und alle montierten Geschütze sind vollständig wiederhergestellt. (3) Wird die Reparatur unterbrochen, bleibt die Funktion inaktiv. (4) Ein zerstörtes Geschütz auf intaktem Wagon ist ohne Reparatur des Wagons reparierbar.
- **Testfälle:** auto: Wagon zerstört, Teilreparatur → Funktion inaktiv. Reparatur abgeschlossen → Funktion aktiv, Geschütze voll. auto: Geschütz zerstört, Wagon intakt → Geschütz reparierbar, Wagon unverändert.
- **Abhängigkeiten:** train-and-defense (REQ-TRN-003), Q-025.
- **Entscheidungsstatus:** CONFIRMED (D-043).

### REQ-REP-006 – Zerstörte Teile sind auch während der Reparatur keine Gegnerziele
- **Problemstellung:** Gegner dürfen kein Teil angreifen, das zerstört ist, selbst wenn es gerade repariert wird.
- **Ziel:** Konsistenz zwischen Reparatur und Zielwahl.
- **Gewünschtes Verhalten:** Ein vollständig zerstörtes Zugteil ist ab Zerstörung bis zum vollständigen Abschluss der Reparatur kein gültiges Gegnerziel.
- **Akzeptanzkriterien:** (1) Zielwahl schließt zerstörte Teile aus, auch bei laufender Reparatur. (2) Nach vollständigem Abschluss ist das Teil wieder ein gültiges Ziel.
- **Testfälle:** auto: Teil zerstört, Reparatur bei 50 % → Zielwahl liefert es nie. Nach Abschluss → wieder wählbar.
- **Abhängigkeiten:** enemies (REQ-ENM-006), Q-023 (Neuwahl bei Zerstörung unterwegs).
- **Entscheidungsstatus:** CONFIRMED (D-039, D-043).
