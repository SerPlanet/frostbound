# Core Gameplay

**Zweck:** Beschreibt Spielfeldaufbau, Spielablauf und Angriffsverlauf des Prototyps.
**Zielgruppe:** Gameplay-Agenten (Spielablauf, Wellen/Spawning).
**Abhängigkeiten:** [scope.md](scope.md); vertiefend [enemies.md](enemies.md), [player.md](player.md), [difficulty.md](difficulty.md).

## Kontext

Der Zug steht im Zentrum (D-004). Gegner laufen von oben auf den Zug zu. Der Spieler und das Zuggeschütz wehren ab, der Spieler repariert. Die Struktur ist lose von Plants vs. Zombies inspiriert (CONFIRMED: D-018), keine Vorlage zum Nachbauen.

## Bestätigte Regeln

- CONFIRMED: Der Zug steht während eines Spieltages still und befindet sich am unteren Rand des Spielfeldes. Der Spielbereich liegt oberhalb des Zuges (D-034, D-012).
- CONFIRMED: Gegner kommen von oben, gegebenenfalls zunächst außerhalb des sichtbaren Bereichs (D-034, D-013).
- CONFIRMED: Gegner kommen kontinuierlich, die Intensität variiert, es gibt größere Gruppen, vor besonders großen Angriffen kann es kurze Pausen geben (D-017).
- CONFIRMED: Die Gegner erscheinen nicht gleichmäßig. Anfangs einzelne Gegner und längere Pausen, im Verlauf kleinere Gruppen und höhere Spawnrate, später größere Gruppen und stärkere Belastung (D-045).
- CONFIRMED: Der Prototyp enthält eine größere Angriffswelle, keine komplexen Bossmechaniken (D-019).
- CONFIRMED: Eine feste Spieldauer ist nicht die Grundlage für den Erfolg. Die Gegnergesamtzahl wird festgelegt und kann je Schwierigkeitsgrad variieren (D-031).
- CONFIRMED: Die Schwierigkeit entsteht hauptsächlich durch Anzahl und Masse der Gegner (D-038).

## Offen

- OPEN: Abmessungen von Spielfeld und sichtbarem Bereich, Hindernisse (Q-011). Beziehung „Runde“ zu „Spieltag“ (Q-030).
- OPEN (Tuning): Gesamtzahl (Q-001), Spawnintervalle und -verteilung (Q-002), Gruppengrößen (Q-003), Zeitpunkt der großen Welle sowie Zeitpunkt und Länge der Pausen (Q-018).

## Anforderungen

### REQ-CORE-001 – Spielfeldaufbau
- **Problemstellung:** Ohne definierte Lage von Zug und Spielfläche sind Spawn, Zielwahl und Bewegung nicht überprüfbar.
- **Ziel:** Zug am unteren Rand, still, Spielfläche darüber.
- **Gewünschtes Verhalten:** Der Zug liegt am unteren Rand des Spielfeldes und bewegt sich während der Runde nicht. Die Spielfläche liegt oberhalb des Zuges. Gegner und Spieler halten sich nur in der Spielfläche auf (Gegner ggf. zunächst oberhalb des sichtbaren Bereichs).
- **Akzeptanzkriterien:** (1) Die Zugposition ändert sich während einer Runde nicht. (2) Der Zug liegt am unteren Rand. (3) Kein Gegner und kein Spieler befindet sich unterhalb der Zugposition. (4) Abmessungen des Spielfelds und des sichtbaren Bereichs kommen aus Konfiguration (keine fest verdrahteten Zahlen im Gameplay).
- **Testfälle:** auto: Über N Ticks bleibt die Zugposition konstant, und alle Entitätspositionen liegen oberhalb der Zuggrenze. manuell: Prototyp starten, Zug unten, Spielbereich oben.
- **Abhängigkeiten:** Q-011 für Abmessungen.
- **Entscheidungsstatus:** CONFIRMED (D-034); OPEN (Maße).

### REQ-CORE-002 – Gegnerstrom mit wachsender Intensität
- **Problemstellung:** Der Angriffsverlauf muss reproduzierbar prüfbar sein, obwohl Zahlen offen sind.
- **Ziel:** Eine festgelegte Gesamtzahl Gegner erscheint mit dem bestätigten Verlauf. Die Spieldauer ist nicht die Grundlage (D-031).
- **Gewünschtes Verhalten:** Ein Wellenplan (Datenstruktur) bestimmt die Gesamtzahl der Gegner und wann wie viele spawnen. Verlauf: (1) Anfang: einzelne Gegner mit längeren Pausen. (2) Mitte: kleinere Gruppen mit höherer Spawnrate. (3) Später: größere Gruppen und stärkere Belastung. Vor besonders großen Angriffen sind kurze Pausen möglich. Der Plan enthält eine größere Angriffswelle ohne Bossmechanik.
- **Akzeptanzkriterien:** (1) Spawns werden ausschließlich vom konfigurierbaren Wellenplan gesteuert. (2) Die Gesamtzahl der Gegner ist im Plan festgelegt und stammt aus dem aktiven Schwierigkeitsprofil. (3) Der Plan kann die drei Phasen und eine Pause vor einer Gruppe abbilden. (4) Die Spawnrate der späten Phase ist im Plan nicht niedriger als die der frühen Phase, und die Gruppengrößen wachsen nicht rückwärts (Struktur der Verlaufsform, keine Zahlen). (5) Es gibt keine feste Spieldauer als Erfolgs- oder Endkriterium. (6) Alle Zahlen stammen aus Konfiguration und sind vorläufig (Tuning).
- **Testfälle:** auto: Mit einem Test-Wellenplan (Testdaten) stimmen Anzahl und Zeitpunkte der Spawns mit dem Plan überein. auto: Plan mit Pause erzeugt im Pausenintervall keine Spawns. auto: Summe der Spawns = Gesamtzahl des Profils. manuell: Verlauf im Greybox-Lauf beobachten.
- **Abhängigkeiten:** [enemies.md](enemies.md), [difficulty.md](difficulty.md); Q-001, Q-002, Q-003, Q-018 für Werte.
- **Entscheidungsstatus:** CONFIRMED (Verlaufsform, D-017, D-019, D-031, D-045); OPEN (Zahlen, Tuning).

### REQ-CORE-003 – Zugorientierte Kernschleife
- **Problemstellung:** Das Spiel muss durch den Zug definiert sein (D-004).
- **Ziel:** Gegner zielen auf den Zug, nicht auf den Spieler.
- **Gewünschtes Verhalten:** Das Spielgeschehen dreht sich um Angriffe auf den Zug und dessen Verteidigung.
- **Akzeptanzkriterien:** Jedes Gegnerziel ist ein Zugteil (siehe REQ-ENM-002). Es gibt keine Gegnerlogik, die den Spieler als Schadensziel behandelt (Spieler ist unsterblich und unbeeinflusst, D-011, D-035).
- **Testfälle:** auto: Alle Gegnerziele sind Zugteile.
- **Abhängigkeiten:** enemies, train-and-defense.
- **Entscheidungsstatus:** CONFIRMED (D-004, D-011, D-035).

## Menschliche Bewertung (nicht durch Agenten)

Spannung, Tempo und Spielgefühl des Angriffsverlaufs bewertet der Projektverantwortliche.
