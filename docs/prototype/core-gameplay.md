# Core Gameplay

**Zweck:** Beschreibt Spielfeldaufbau, Spielablauf und Angriffsverlauf des Prototyps.
**Zielgruppe:** Gameplay-Agenten (Spielablauf, Wellen/Spawning).
**Abhängigkeiten:** [scope.md](scope.md); vertiefend [enemies.md](enemies.md), [player.md](player.md).

## Kontext

Der Zug steht im Zentrum (D-004). Gegner laufen von der Gegenseite auf den Zug zu. Der Spieler und das Zuggeschütz wehren ab, der Spieler baut/repariert. Die Struktur ist lose von Plants vs. Zombies inspiriert (CONFIRMED: D-018), sie ist keine Vorlage zum Nachbauen.

## Bestätigte Regeln

- CONFIRMED: Der Zug befindet sich an einer Seite des Spielbereichs. Die Spielfläche liegt ausschließlich auf einer Seite des Zuges (D-012).
- CONFIRMED: Gegner starten auf der dem Zug gegenüberliegenden Seite (D-013).
- CONFIRMED: Gegner kommen kontinuierlich, die Intensität variiert, es gibt größere Gruppen, vor besonders großen Angriffen kann es kurze Pausen geben (D-017).
- CONFIRMED: Der Prototyp enthält eine größere Angriffswelle, keine komplexen Bossmechaniken (D-019).

## Offen

- OPEN: Position und Abmessungen des Spielfelds, Seite des Zuges (Q-011, Q-017).
- OPEN: Spawnintervalle (Q-002), Zusammensetzung größerer Gruppen (Q-003), Dauer/Zeitplan, Pausenlänge, Zeitpunkt der Welle (Q-018).

## Anforderungen

### REQ-CORE-001 – Einseitige Spielfläche
- **Problemstellung:** Ohne definierte Lage von Zug und Spielfläche sind Spawn, Zielwahl und Bewegung nicht überprüfbar.
- **Ziel:** Zug an einer Seite, Spielfläche nur auf einer Seite des Zuges.
- **Gewünschtes Verhalten:** Die begehbare/bespielte Fläche liegt vollständig auf der einen Seite des Zuges. Auf der anderen Seite des Zuges findet kein Spiel statt.
- **Akzeptanzkriterien:** (1) Kein Gegner und keine Spielerposition liegt je auf der vom Spielfeld abgewandten Seite des Zuges. (2) Maße und Seite sind über eine Konfiguration austauschbar (keine fest verdrahteten Zahlen im Gameplay).
- **Testfälle:** auto: Simulation mit Konfiguration, alle Positionen der Entitäten über N Ticks bleiben auf der Spielfeldseite. manuell: Prototyp starten und prüfen, dass nur eine Seite des Zuges bespielt wird.
- **Abhängigkeiten:** Q-011, Q-017 für konkrete Werte.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-012); OPEN (Maße, Seite).

### REQ-CORE-002 – Kontinuierlicher Gegnerstrom mit variierender Intensität
- **Problemstellung:** Der Angriffsverlauf muss reproduzierbar prüfbar sein, obwohl Zahlen offen sind.
- **Ziel:** Gegner erscheinen über die Runde fortlaufend, die Intensität schwankt.
- **Gewünschtes Verhalten:** Ein Wellenplan (Datenstruktur) bestimmt, wann wie viele Gegner spawnen. Er enthält Phasen unterschiedlicher Intensität, größere Gruppen und optionale kurze Pausen vor großen Angriffen.
- **Akzeptanzkriterien:** (1) Spawns werden ausschließlich vom konfigurierbaren Wellenplan gesteuert. (2) Der Plan kann Phasen mit unterschiedlicher Spawnrate abbilden. (3) Der Plan kann eine Pause vor einer Gruppe abbilden. (4) Der Plan enthält für den Prototyp genau eine größere Angriffswelle, ohne Bossmechanik. (5) Konkrete Zahlen kommen aus Konfiguration, nicht aus dem Code.
- **Testfälle:** auto: Mit einem Test-Wellenplan (Testdaten, nicht Spielwerte) wird die Anzahl und der Zeitpunkt der Spawns gegen den Plan geprüft. auto: Plan mit Pause erzeugt im Pausenintervall keine Spawns. manuell: Beschreibung der Welle im Greybox-Lauf beobachten.
- **Abhängigkeiten:** [enemies.md](enemies.md), [difficulty.md](difficulty.md); Q-002, Q-003, Q-018 für Werte.
- **Entscheidungsstatus:** CONFIRMED (Struktur, D-017, D-019); OPEN (Zahlen).

### REQ-CORE-003 – Zugorientierte Kernschleife
- **Problemstellung:** Das Spiel muss durch den Zug definiert sein (D-004).
- **Ziel:** Gegner zielen auf den Zug, nicht auf den Spieler.
- **Gewünschtes Verhalten:** Das Spielgeschehen dreht sich um Angriffe auf den Zug und dessen Verteidigung.
- **Akzeptanzkriterien:** Jedes Gegnerverhalten referenziert ein Zugziel (siehe REQ-ENM-002). Es gibt keine Gegnerlogik, die den Spieler als Schadensziel behandelt (Spieler ist unsterblich, D-011).
- **Testfälle:** auto: Gegnerziele sind stets Zugziele. manuell: Greybox-Lauf ansehen.
- **Abhängigkeiten:** enemies, train-and-defense.
- **Entscheidungsstatus:** CONFIRMED (D-004, D-011); Details zu Q-015 OPEN.

## Menschliche Bewertung (nicht durch Agenten)

Spannung, Tempo und Spielgefühl des Angriffsverlaufs bewertet der Projektverantwortliche.
