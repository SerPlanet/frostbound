# Implementierungsplan Prototyp

**Zweck:** Kleiner, überprüfbarer Plan für die Umsetzung des Prototyps in Arbeitsschritten.
**Zielgruppe:** Implementierungs-Agenten. Pro Schritt genügen die genannten Dokumente.
**Abhängigkeiten:** [architecture.md](architecture.md) (Struktur, Werte, TECH-Entscheidungen), [testing-and-greybox.md](testing-and-greybox.md), [../project/process.md](../project/process.md) (Definition of Done, Git-Regeln).

## Rahmen

- Reihenfolge nach technischen Abhängigkeiten: zuerst die Logik und ihre Prüfungen, dann die Darstellung, die jeweils auf der Logik aufbaut.
- Jeder Schritt endet mit grünem Selbsttest (`node src/tests/selftest.ts`), soweit er Logik berührt, und mit einer kurzen manuellen Prüfung, soweit er Darstellung berührt.
- Normale, geprüfte Änderungen dürfen nach `main` (D-033). Größere Architekturänderungen und Änderungen an bestätigten Spielregeln brauchen vorher Freigabe.
- Nicht umsetzen: alles aus [../prototype/scope.md](../prototype/scope.md), Abschnitt „Nicht im Umfang“ (u. a. Audio, Drops, Progression, weitere Waggons und Geschütze, Spielertod).
- Subjektive Kriterien (Spielgefühl, Spannung, visuelle Qualität) sind menschliche Bewertungsaufgaben des Projektverantwortlichen.

## Schritt 1 – Grundprojekt und Spielstart
- **Ziel:** Vite-Projekt mit Phaser und TypeScript, leeres 16:9-Spielfeld skaliert, Veröffentlichung über GitHub Pages.
- **Module:** `package.json`, `tsconfig.json`, `vite.config.ts` (base `/frostbound/`), `index.html`, `src/main.ts`, `.github/workflows/pages.yml` (Build und `dist/` veröffentlichen).
- **Anforderungen:** REQ-ARC-005, REQ-ARC-006, REQ-ARC-003.
- **Akzeptanzkriterien:** (1) `npm run dev` zeigt ein 16:9-Spielfeld, das sich proportional skaliert. (2) `npm run build` läuft fehlerfrei. (3) Abhängigkeiten sind nur Phaser, TypeScript, Vite. (4) Der Pages-Workflow veröffentlicht das gebaute Spiel erfolgreich unter der bekannten URL. (5) Die bisherige Startseite wird dadurch ersetzt.
- **Testfälle:** manuell: Fenstergröße ändern. Build ausführen. Pages-Lauf und URL prüfen.
- **Abhängigkeiten:** keine. Installation von Paketen und Änderung des Workflows sind hier ausdrücklich Teil des Auftrags.

## Schritt 2 – Gameplay-Kern, Konfiguration, Selbsttest
- **Ziel:** Typen, Konfiguration, `createWorld`, `stepWorld` (zunächst Gerüst mit Spielschritt-Reihenfolge und Einfrieren nach Spielende), Selbsttest-Rahmen, der in Node läuft.
- **Module:** `src/config.ts`, `src/game/types.ts`, `src/game/world.ts`, `src/tests/selftest.ts`.
- **Anforderungen:** REQ-ARC-001, REQ-ARC-004, REQ-ARC-007, REQ-TST-003, REQ-WL-005 (Einfrieren), REQ-TRN-001, REQ-TRN-002.
- **Akzeptanzkriterien:** (1) `node src/tests/selftest.ts` läuft ohne Browser und meldet Ergebnisse je Prüfung. (2) `game/` importiert kein Phaser. (3) Alle Werte sind in `config.ts` getrennt nach CONFIRMED, LAYOUT, TESTWERTE. (4) Neue Welt: eine Lokomotive, ein Wagon, ein Geschütz am Wagon, Werte 100/100/20, Status `running`. (5) Bei Status ungleich `running` verändert `stepWorld` nichts.
- **Testfälle:** auto: Zugaufbau, Startwerte, Einfrieren nach Spielende, zwei identische Läufe mit gleicher Zufallsfunktion.
- **Abhängigkeiten:** Schritt 1.

## Schritt 3 – Szenen und Greybox-Darstellung
- **Ziel:** Spielfeld mit Zug, Zonen und HUD-Rahmen als Greybox, Szenenablauf Start → Runde → Ergebnis mit Platzhalterinhalt, Visuals-Testmodus.
- **Module:** `src/scenes/*`, `src/view/WorldView.ts`, `src/view/Hud.ts` (nur Rahmen), `src/main.ts` (Modus).
- **Anforderungen:** REQ-ARC-002, REQ-ARC-003, REQ-TST-001, REQ-TST-002, REQ-CORE-001, REQ-CORE-004, REQ-FLOW-001 (Gerüst).
- **Akzeptanzkriterien:** (1) Lokomotive, Wagon, Geschütz sind als Formen am unteren Rand sichtbar. (2) `?mode=visuals` zeigt die Zustände intakt, beschädigt, zerstört und die Reparaturzonen ohne Simulation. (3) Szenen enthalten keine Regeln. (4) Keine Bilddateien.
- **Testfälle:** manuell: alle Modi starten. Review: Szenen enthalten keine Spielregeln.
- **Abhängigkeiten:** Schritt 2.

## Schritt 4 – Spielerbewegung
- **Ziel:** Spieler per WASD und Pfeiltasten bewegen, Grenzen, Zug gesperrt, frei durch Gegner.
- **Module:** `src/game/player.ts`, `src/input/keyboard.ts`, Darstellung in `WorldView`.
- **Anforderungen:** REQ-PLR-001, REQ-PLR-002, REQ-PLR-004, REQ-PLR-005.
- **Akzeptanzkriterien:** Siehe die genannten Anforderungen. Insbesondere: Diagonale gleich schnell, Position bleibt im begehbaren Bereich, keine Spielerlebenspunkte.
- **Testfälle:** auto: Richtungsvektoren, Normierung, Grenzen, Zugsperre. manuell: alle 8 Tasten.
- **Abhängigkeiten:** Schritt 2, 3.

## Schritt 5 – Zug, Schaden und Zerstörung
- **Ziel:** Lebenspunkte je Teil, Schaden, Zerstörungsstatus, Wagon-Geschütz-Abhängigkeit (noch ohne Gegner, über Testaufrufe).
- **Module:** `src/game/world.ts` und ein kleines Hilfsmodul für Teile (z. B. in `enemies.ts` oder `repair.ts`, keine neue Schicht).
- **Anforderungen:** REQ-TRN-003, REQ-TRN-004, REQ-TRN-005.
- **Akzeptanzkriterien:** Schaden 10, getrennte Lebenspunkte, Status „zerstört“ bei 0, Wagon zerstört ⇒ Geschütz zerstört, Lebenspunkte nie unter 0 oder über dem Maximum.
- **Testfälle:** auto: Schaden an Lokomotive und Wagon, Zerstörung, Geschütz folgt dem Wagon.
- **Abhängigkeiten:** Schritt 2.

## Schritt 6 – Gegner: Spawning, Bewegung, Zielwahl
- **Ziel:** Gegner laut Wellenplan erzeugen, auf ein zufällig gewähltes intaktes Teil zulaufen, bei Kontakt 10 Schaden anwenden und verschwinden, bei Zerstörung des Ziels sofort neu wählen.
- **Module:** `src/game/spawning.ts`, `src/game/enemies.ts`, Wellenpläne in `config.ts`, Darstellung der Gegner.
- **Anforderungen:** REQ-ENM-001 bis REQ-ENM-008, REQ-CORE-002, REQ-DIF-002.
- **Akzeptanzkriterien:** (1) Spawns oberhalb des Spielfeldes. (2) Gesamtzahl je Grad stimmt mit dem Plan. (3) Zielwahl nur unter intakten Teilen, nie das Geschütz. (4) Kontakt: einmal 10 Schaden, Gegner entfernt, als Zug erreicht gezählt. (5) Neuwahl im selben Schritt der Zerstörung. (6) Gerade Bewegung ohne Ausweichen.
- **Testfälle:** auto: siehe die Testfälle der REQ-ENM-Anforderungen mit fester Zufallsfunktion. manuell: Gegner laufen von oben ein.
- **Abhängigkeiten:** Schritt 2, 3, 5.

## Schritt 7 – Automatische Angriffe
- **Ziel:** Spielerangriff und Geschützangriff, Besiegen, Zuordnung der Kills.
- **Module:** `src/game/combat.ts`, Trefferlinie in `WorldView`.
- **Anforderungen:** REQ-CMB-001 bis REQ-CMB-005.
- **Akzeptanzkriterien:** Zwei unabhängige Quellen mit eigener Abkühlung, Spieler nächster Gegner in Reichweite (Einzelziel), Geschütz nächster geeigneter Gegner im gesamten Spielfeld und nur bei funktionsfähigem Wagon, besiegte Gegner richten keinen Schaden an, Kill-Zähler je Quelle.
- **Testfälle:** auto: Reichweitengrenzen, nächster Gegner, Unabhängigkeit, zerstörter Wagon ⇒ kein Geschützschuss. manuell: Angriffe beobachten.
- **Abhängigkeiten:** Schritt 4, 5, 6.

## Schritt 8 – Reparatur
- **Ziel:** Reparaturzonen, 5 HP je 5 s, Pausenfortschritt, ein Objekt gleichzeitig, Wiederherstellung inklusive Geschütz.
- **Module:** `src/game/repair.ts`, Zonen in `WorldView`.
- **Anforderungen:** REQ-REP-001 bis REQ-REP-006, REQ-PLR-003.
- **Akzeptanzkriterien:** Siehe die genannten Anforderungen. Insbesondere: 0 auf 100 HP in 100 s Aufenthalt, Zähler bleibt beim Verlassen, Zonen nur bei Reparaturbedarf, alle gleichzeitig sichtbar, zerstört bleibt zerstört bis zum Abschluss, Geschütz danach 20/20, Spielerangriff läuft weiter.
- **Testfälle:** auto: siehe Testfälle der REQ-REP-Anforderungen. manuell: Reparatur im Greybox-Lauf.
- **Abhängigkeiten:** Schritt 4, 5, 6.

## Schritt 9 – Rundenende, Ablauf, HUD, Statistik
- **Ziel:** Sieg und Niederlage, Einfrieren, Startbildschirm mit Schwierigkeitswahl, HUD, Ergebnisbildschirm mit Statistik, Neustart.
- **Module:** `src/game/roundEnd.ts`, `src/game/stats.ts`, `src/scenes/StartScene.ts`, `ResultScene.ts`, `src/view/Hud.ts`.
- **Anforderungen:** REQ-WL-001 bis REQ-WL-005, REQ-FLOW-001 bis REQ-FLOW-003, REQ-HUD-001, REQ-STA-001, REQ-DIF-001.
- **Akzeptanzkriterien:** (1) Niederlage im selben Schritt, in dem das letzte intakte Teil zerstört wird, Vorrang vor dem Sieg. (2) Sieg erst, wenn alles gespawnt, nichts aktiv und mindestens ein Teil intakt ist. (3) Nach Spielende keine Veränderung mehr. (4) Alle sieben Statistikwerte werden angezeigt. (5) Neue Runde mit vollständig neuem Zustand. (6) Drei wählbare Grade.
- **Testfälle:** auto: siehe die REQ-WL-, REQ-STA-Testfälle, Summenprüfung bei Sieg. manuell: eine Runde pro Grad durchspielen.
- **Abhängigkeiten:** Schritt 3 bis 8.

## Schritt 10 – Gesamtprüfung und erste spielbare Version
- **Ziel:** Alles zusammen prüfen, Fehler beheben, die erste Version für das Feedback veröffentlichen.
- **Module:** keine neuen. Gegebenenfalls Anpassung der Testwerte in `config.ts`.
- **Anforderungen:** alle REQ der Prototyp-Dokumente, Definition of Done aus [../project/process.md](../project/process.md).
- **Akzeptanzkriterien:** (1) Selbsttest vollständig bestanden. (2) Alle drei Testmodi laufen. (3) Je Grad wurde eine Runde bis Sieg oder Niederlage gespielt. (4) Der Abschlussbericht nennt erfüllte und nicht erfüllte Kriterien und trennt „technisch abgeschlossen“, „erfolgreich getestet“ und „inhaltlich akzeptiert“ (nur der Projektverantwortliche). (5) Veröffentlichung über GitHub Pages ist erfolgreich und die URL erreichbar. (6) Die Dokumentation ist aktualisiert (Start der Testmodi, geänderte TECH-Entscheidungen).
- **Testfälle:** auto: Selbsttest. manuell: Checkliste je Anforderungsdokument. menschl. Bewertung: Spielgefühl, Balance, Lesbarkeit der Zonen durch den Projektverantwortlichen.
- **Abhängigkeiten:** Schritt 1 bis 9.

## Abhängigkeitsübersicht

1 → 2 → 3 → 4. Schritt 5 hängt nur von 2 ab. Schritt 6 braucht 2, 3, 5. Schritt 7 braucht 4, 5, 6. Schritt 8 braucht 4, 5, 6. Schritt 9 braucht 3 bis 8. Schritt 10 schließt alles ab.
