# Spielablauf, Menüs und HUD

**Zweck:** Beschreibt den einfachen Ablauf des Prototyps vom Startbildschirm bis zur Rückkehr sowie das minimale HUD.
**Zielgruppe:** Gameplay-/UI-Agent Spielablauf.
**Abhängigkeiten:** [win-lose.md](win-lose.md) (Ergebnisse), [difficulty.md](difficulty.md) (Auswahl), [balance-and-statistics.md](balance-and-statistics.md) (Rundenstatistik), [../technical/architecture.md](../technical/architecture.md).

## Bestätigter Ablauf (D-047, D-042)

1. Startbildschirm.
2. Auswahl der Schwierigkeit (Gemütlich, Normal, Winterhart).
3. Start der Runde.
4. Gameplay mit einfachem HUD.
5. Sieg- oder Niederlagenbildschirm.
6. Rückkehr zum Startbildschirm, um eine weitere Runde zu starten.

CONFIRMED: Keine komplexen Menüs und keine Progressionsbildschirme. Das HUD zeigt zunächst nur die wichtigsten Informationen.

## Offen

- OPEN: Welche Informationen das HUD im Einzelnen zeigt (Q-029). Ein Vorschlag steht unten als PROPOSED.
- OPEN: Details des Startbildschirms, ein voreingestellter Schwierigkeitsgrad, Darstellung der Rundenstatistik (Q-029, Q-019).
- OPEN: Zielplattform, Auflösung, Eingabegeräte (Q-031).
- OPEN: Pause, Abbruch einer laufenden Runde: nicht festgelegt und nicht Teil dieses Dokuments.

## Anforderungen

### REQ-FLOW-001 – Rundenablauf
- **Problemstellung:** Der Prototyp braucht einen geschlossenen, wiederholbaren Ablauf.
- **Ziel:** Von Start über Runde und Ergebnis zurück zum Start.
- **Gewünschtes Verhalten:** Zustände in dieser Reihenfolge: Startbildschirm → Schwierigkeitswahl → Runde → Ergebnisbildschirm (Sieg oder Niederlage) → Startbildschirm. Aus dem Startbildschirm kann eine neue Runde gestartet werden.
- **Akzeptanzkriterien:** (1) Jeder Übergang ist erreichbar und führt zum genannten Folgezustand. (2) Nach einem Ergebnisbildschirm erreicht man den Startbildschirm. (3) Eine neue Runde beginnt mit vollständig zurückgesetztem Zustand (Zug, Gegner, Fortschritt, Statistik). (4) Es gibt keine weiteren Menüs oder Progressionsbildschirme.
- **Testfälle:** auto: Ablaufzustandsautomat wird mit Testereignissen durch alle Übergänge geführt. auto: zwei Runden hintereinander liefern denselben Anfangszustand. manuell: Eine Runde komplett durchspielen, Sieg und Niederlage.
- **Abhängigkeiten:** win-lose, architecture (Szenen ohne Logik).
- **Entscheidungsstatus:** CONFIRMED (D-047, D-042).

### REQ-FLOW-002 – Startbildschirm und Schwierigkeitswahl
- **Problemstellung:** Der Spieler muss einen der drei Schwierigkeitsgrade wählen können.
- **Ziel:** Auswahl vor jedem Rundenstart.
- **Gewünschtes Verhalten:** Der Startbildschirm bzw. die Auswahl bietet genau die Grade Gemütlich, Normal und Winterhart. Mit der Wahl startet die Runde mit dem gewählten Profil.
- **Akzeptanzkriterien:** (1) Genau drei Grade sind wählbar, mit diesen Namen. (2) Die Runde verwendet das gewählte Profil (siehe REQ-DIF-001). (3) Ohne Wahl startet keine Runde. Ein Standardgrad ist OPEN und nicht vorgegeben.
- **Testfälle:** auto: Wahl jedes Grades → aktives Profil entspricht der Wahl. manuell: Auswahl im Browser.
- **Abhängigkeiten:** difficulty.
- **Entscheidungsstatus:** CONFIRMED (D-047, D-021); OPEN (Standardgrad, Layout).

### REQ-FLOW-003 – Sieg- und Niederlagenbildschirm
- **Problemstellung:** Das Rundenergebnis muss sichtbar werden.
- **Ziel:** Ergebnisbildschirm mit Rundenstatistik.
- **Gewünschtes Verhalten:** Bei Sieg oder Niederlage erscheint ein Bildschirm, der das Ergebnis benennt und die Rundenstatistik (siehe REQ-STA-001) zeigt. Von dort geht es zum Startbildschirm.
- **Akzeptanzkriterien:** (1) Der Bildschirm zeigt eindeutig „Sieg“ bzw. „Niederlage“ entsprechend dem Rundenergebnis. (2) Die Statistik wird auf diesem Bildschirm angezeigt. (3) Es gibt einen Weg zurück zum Startbildschirm.
- **Testfälle:** auto: Ergebnis „Sieg“ bzw. „Niederlage“ → entsprechender Zustand mit Statistikdaten. manuell: beide Bildschirme ansehen.
- **Abhängigkeiten:** win-lose, balance-and-statistics (REQ-STA-001).
- **Entscheidungsstatus:** CONFIRMED (D-047, D-048); OPEN (Darstellungsdetails, Q-029).

### REQ-HUD-001 – Minimales HUD
- **Problemstellung:** Der Spieler braucht die wichtigsten Informationen während der Runde.
- **Ziel:** Ein einfaches HUD ohne komplexe Anzeigen.
- **Gewünschtes Verhalten:** Das HUD zeigt nur wenige, wichtige Informationen. Es liest den Gameplay-Zustand und verändert ihn nicht.
- **Akzeptanzkriterien:** (1) Das HUD enthält nur die in diesem Dokument oder später freigegebene Informationen. (2) Das HUD verändert keinen Spielzustand. (3) Das HUD funktioniert in der Greybox ohne Grafikassets.
- **Vorschlag (PROPOSED, nicht umsetzen ohne Freigabe):** Lebenspunkte je Zugteil und Anzahl noch ausstehender Gegner. Weitere Anzeigen (z. B. Schwierigkeitsgrad, Reparaturfortschritt) sind OPEN.
- **Testfälle:** auto: HUD-Daten entsprechen dem Gameplay-Zustand zu einem Zeitpunkt. manuell: HUD ansehen. menschl. Bewertung: ob die Informationen „die wichtigsten“ sind und gut lesbar, bewertet der Projektverantwortliche.
- **Abhängigkeiten:** architecture (REQ-ARC-001), Q-029.
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-047); PROPOSED/OPEN (Inhalt, Q-029).
