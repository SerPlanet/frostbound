# Testbarkeit und Greyboxing

**Zweck:** Legt Anforderungen an Tests und Platzhaltergrafiken fest.
**Zielgruppe:** Alle Code-Agenten, Test-Agenten.
**Abhängigkeiten:** [architecture.md](architecture.md).

## Bestätigte Regeln

- CONFIRMED: Es gibt separate Testmöglichkeiten für Gameplay, Visuals und die kombinierte Darstellung (D-025).
- CONFIRMED: Greybox-Grafiken (einfache geometrische Platzhalter) statt finaler Grafiken (D-006).

## Offen

- OPEN: Konkrete Form der Testmöglichkeiten (Testszenen, URL-Parameter, Skripte, Test-Framework), Q-020.

## Anforderungen

### REQ-TST-001 – Drei getrennte Testmöglichkeiten
- **Problemstellung:** Fehler sollen nach Gameplay, Visuals oder Zusammenspiel eingrenzbar sein.
- **Ziel:** Gameplay, Visuals und kombinierte Darstellung sind jeweils getrennt prüfbar.
- **Gewünschtes Verhalten:** (a) Gameplay-Test: Simulation ohne Darstellung. (b) Visuals-Test: Darstellung mit vorgegebenem/statischem Zustand ohne laufende Gameplay-Logik. (c) Kombinierter Test: Gameplay und Darstellung zusammen.
- **Akzeptanzkriterien:** (1) Alle drei Testarten sind einzeln startbar. (2) Der Gameplay-Test benötigt weder Browser noch Canvas. (3) Der Visuals-Test benötigt keine laufende Gameplay-Simulation. (4) Der kombinierte Test existiert und startet den Prototyp mit Platzhaltern. (5) Wie sie gestartet werden, ist in der Dokumentation beschrieben.
- **Testfälle:** manuell/auto: Jede der drei Testarten ausführen und Ergebnis dokumentieren.
- **Abhängigkeiten:** REQ-ARC-001, REQ-ARC-002; Q-020 für die Form.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-025); OPEN (Form).

### REQ-TST-002 – Greybox-Darstellung
- **Problemstellung:** Der Prototyp soll ohne Assets lauffähig sein.
- **Ziel:** Alle Entitäten sind einfache geometrische Formen.
- **Gewünschtes Verhalten:** Zug (Lokomotive, Wagon), Spieler, Gegner, Geschütz und Projektile erscheinen als einfache Formen, unterscheidbar durch Form/Farbe/Größe.
- **Akzeptanzkriterien:** (1) Alle genannten Entitäten sind ohne externe Bilddateien dargestellt. (2) Die Entitätsarten sind visuell unterscheidbar.
- **Testfälle:** manuell: Prototyp starten, jede Entitätsart identifizieren. Die visuelle Qualität ist eine menschliche Bewertung und für Greybox kein Kriterium.
- **Abhängigkeiten:** REQ-ARC-003.
- **Entscheidungsstatus:** CONFIRMED (D-006).

### REQ-TST-003 – Automatisierte Tests für Gameplay-Anforderungen
- **Problemstellung:** Akzeptanzkriterien müssen wiederholbar prüfbar sein.
- **Ziel:** Jedes objektiv prüfbare Akzeptanzkriterium hat einen automatisierten Test, sonst eine dokumentierte manuelle Prüfung.
- **Gewünschtes Verhalten:** Tests laufen deterministisch (fester Zufalls-Seed, fester Zeitschritt).
- **Akzeptanzkriterien:** (1) Jeder Test ist reproduzierbar. (2) Das Ergebnis jedes Testlaufs ist im Abschlussbericht benannt. (3) Nicht automatisierbare Kriterien haben eine nachvollziehbare manuelle Testbeschreibung.
- **Testfälle:** auto: Zweimaliger Lauf mit gleichem Seed ergibt identisches Ergebnis.
- **Abhängigkeiten:** project/process (Definition of Done).
- **Entscheidungsstatus:** CONFIRMED (Testpflicht, D-029); PROPOSED (Determinismus durch Seed und festen Zeitschritt als Technik).
