# Technische Architektur des Prototyps

**Zweck:** Beschreibt die schlanke technische Architektur für den spielbaren Prototyp: Aufbau, Trennung von Gameplay und Darstellung, Datenmodell, Spielschritt, Ordnerstruktur und Konfigurationswerte.
**Zielgruppe:** Alle Code-Agenten.
**Abhängigkeiten:** [testing-and-greybox.md](testing-and-greybox.md), [implementation-plan.md](implementation-plan.md). Fachliche Regeln stehen in den Dokumenten unter `docs/prototype/`, dieses Dokument wiederholt sie nur, wo für die Technik nötig.

## Kennzeichnung

| Tag | Bedeutung |
|---|---|
| **CONFIRMED** | Bestätigte Gameplay-Regel oder bestätigter Startwert. Nicht ändern. |
| **TECH-nn** | Technische Architekturentscheidung (D-060). Revidierbar, ändert keine bestätigte Gameplay-Regel. |
| **TESTWERT** | Vorläufiger Zahlenwert, im Spieltest anzupassen (D-045). |
| **OFFEN** | Noch nicht entschiedene Gameplay-Frage. Siehe [../open-questions.md](../open-questions.md). |

Es gibt derzeit keine offene Gameplay-Frage, die die Implementierung blockiert.

## 1. Grundprinzip

Technologie: Phaser 3, TypeScript, Vite, GitHub Pages (CONFIRMED, D-026, D-049). Keine weiteren Laufzeit- oder Testpakete (D-060).

Der Prototyp besteht aus zwei Schichten:

1. **`game/`** ist die komplette Spiellogik als reines TypeScript ohne Phaser, ohne DOM, ohne Zeit- oder Zufallsquelle im Inneren. Ihr Kern ist eine Funktion `stepWorld(world, input, dtMs)`, die den Spielzustand um einen festen Zeitschritt voranbringt.
2. **`scenes/`, `view/`, `input/`** sind Phaser: Szenen, Zeichnen des Zustands, Tastatur. Diese Schicht liest den Zustand und ruft `stepWorld` auf, enthält aber keine Spielregeln.

Datenfluss: Tastatur → `input/` (Richtungsvektor) → `GameScene` → `stepWorld(world, input, dt)` → verändert `world` → `view/` zeichnet `world`. Rückwirkungen von `view/` auf `game/` gibt es nicht.

## 2. Spielablauf

| Zustand | Szene | Inhalt | Anforderung |
|---|---|---|---|
| Start | StartScene | Titel, drei Felder Gemütlich/Normal/Winterhart. Auswahl per Mausklick oder Taste 1/2/3 (TECH-12) | REQ-FLOW-002 |
| Runde | GameScene | Spielfeld, Zug, Spieler, Gegner, Reparaturzonen, HUD | REQ-FLOW-001, REQ-HUD-001 |
| Ergebnis | ResultScene | „Sieg“ oder „Niederlage“ und Rundenstatistik, Enter oder Klick zurück zum Start | REQ-FLOW-003, REQ-STA-001 |
| Visuals-Test | VisualsScene | nur im Testmodus, statische Darstellung aller Zustände (TECH-13) | REQ-TST-001 |

Übergänge: Start → Runde (nach Auswahl) → Ergebnis (wenn `world.status` nicht mehr `running`) → Start. Der Szenenwechsel ist die einzige Aufgabe der Szenen in Bezug auf den Ablauf. Jede neue Runde erzeugt mit `createWorld(difficulty)` eine vollständig neue Welt.

## 3. Spielobjekte und Datenmodell

Alle Typen in `game/types.ts`. Positionen in logischen Einheiten (LE).

| Objekt | Felder (Auswahl) | Hinweis |
|---|---|---|
| `World` | `status` (running, won, lost), `difficulty`, `timeMs`, `player`, `locomotive`, `wagon`, `turret`, `enemies`, `spawnPlan`, `stats`, `events`, `activeRepair`, `random` | `random` ist eine austauschbare Funktion (TECH-15) |
| `Player` | `x`, `y`, `attackCooldownMs` | keine Lebenspunkte (CONFIRMED, D-057) |
| `Enemy` | `id`, `x`, `y`, `hp`, `target` (`locomotive` oder `wagon`) | genau ein Typ (CONFIRMED, D-038) |
| `TrainPart` (Lokomotive, Wagon) | `rect`, `zone`, `hp`, `maxHp`, `destroyed`, `repairProgressMs` | `destroyed` bleibt bis zum Reparaturabschluss, auch wenn `hp` steigt (REQ-TRN-003) |
| `Turret` | `hp`, `maxHp`, `destroyed`, `attackCooldownMs`, Position | gehört zum Wagon. `destroyed` folgt `wagon.destroyed` (REQ-TRN-005) |
| `Stats` | gespawnt, Kills Spieler, Kills Geschütz, Zug erreicht, Schaden je Zugteil, Reparaturzeit je Zugteil, Ergebnis | REQ-STA-001 |
| `GameEvent` | z. B. `enemyDefeated`, `enemyReachedTrain`, `partDestroyed`, `partRepaired`, `shot` | Liste je Schritt, nur Lesezugriff für Darstellung und Statistik (TECH-16) |

Ein Zugteil ist **intakt**, wenn `destroyed === false`. Das Geschütz hat nur seinen eigenen Zustand für die Wagon-Abhängigkeit und ist nie Gegnerziel.

## 4. Gameplay-Systeme und Spielschritt

`stepWorld(world, input, dtMs)` arbeitet bei jedem Aufruf in dieser festen Reihenfolge (TECH-14). Ist `world.status` nicht `running`, tut die Funktion nichts (REQ-WL-005).

| Schritt | Modul | Tätigkeit | Anforderungen |
|---|---|---|---|
| 1 | `player.ts` | Spieler bewegen (normiert, Grenzen, Sperrzone Zug) | PLR-001, PLR-002, PLR-004, PLR-005 |
| 2 | `spawning.ts` | Gegner laut Wellenplan erzeugen (oberhalb, zufällige x-Position, Ziel wählen) | ENM-001, ENM-002, ENM-007, CORE-002 |
| 3 | `enemies.ts` | Gegner auf Ziel zubewegen | ENM-005 |
| 4 | `enemies.ts` | Kontakt prüfen: einmalig 10 Schaden, Gegner entfernen, Zähler; Zerstörung des Teils; Wagon zerstört → Geschütz zerstört; betroffene Gegner wählen sofort neu | ENM-003, ENM-006, ENM-008, TRN-003, TRN-004, TRN-005 |
| 5 | `combat.ts` | Spielerangriff und Geschützangriff (Abkühlung, Zielwahl, Soforttreffer, Besiegen, Kill-Zuordnung) | CMB-001 bis CMB-005 |
| 6 | `repair.ts` | Reparatur (eine Zone, Zähler, 5 HP je 5 s, Abschluss: intakt, Geschütz 20/20) | REP-001 bis REP-006 |
| 7 | `roundEnd.ts` | Niederlage prüfen (alle Teile zerstört), danach Sieg prüfen (alles gespawnt, keiner aktiv, mindestens ein Teil intakt) | WL-002, WL-003 |
| 8 | `stats.ts` | Statistik aus Ereignissen und Zählern fortschreiben | STA-001 |

Die Reihenfolge ist technisch festgelegt (TECH-14). Besonders: Die Niederlage hat Vorrang vor dem Sieg (CONFIRMED, D-050). Spawn, Gegner und Angriffe nach Spielende werden nicht mehr ausgewertet (CONFIRMED, D-050).

## 5. Darstellung

`view/WorldView.ts` zeichnet mit Phaser Graphics/Shapes (Greybox, keine Bilddateien, CONFIRMED D-006, D-024):

- Spielfeld 16:9, Zugbereich unten, Lokomotive, Wagon, Geschütz als Formen, Zerstörung sichtbar (z. B. andere Farbe).
- Reparaturzonen als farbige Flächen, nur sichtbar, wenn das Objekt reparierbar ist, alle gleichzeitig (CONFIRMED, D-056). Die aktuell repariert werdende Zone wird zusätzlich hervorgehoben (TECH, Darstellung).
- Spieler und Gegner als einfache Formen, kurze Trefferlinie bei `shot`-Ereignissen.
- `view/Hud.ts`: Lebenspunkte von Lokomotive und Wagon, Geschützzustand, ausstehende Gegner, Schwierigkeitsgrad (TECH-11).

Start- und Ergebnisbildschirm sind Phaser-Texte und -Formen in den Szenen, kein DOM-UI (TECH).

## 6. Technische Trennung (pragmatisch)

- `game/` importiert nichts aus `scenes/`, `view/`, `input/` und kein Phaser. Es darf `config.ts` lesen.
- Eingaben: `input/keyboard.ts` liefert einen Richtungsvektor `{x, y}` mit Werten −1, 0, 1. Gleichzeitige gegenläufige Tasten heben sich auf (TECH-04). Die Normierung für die Diagonale geschieht in `game/player.ts` (CONFIRMED-Regel REQ-PLR-001).
- Szenen enthalten keine Regeln: Sie rufen `stepWorld` auf und wechseln Szenen.
- Die Darstellung liest `world` und `world.events`. Statistik und Darstellung teilen sich dieselben Ereignisse.
- Zufall: Die Welt bekommt `random: () => number`. Standard ist `Math.random`, Tests geben eine feste Funktion (TECH-15). Es gibt kein Seed-System (D-060).
- Zeit: Die Szene sammelt Frame-Zeit und ruft `stepWorld` mit festen Schritten von 1000/60 ms auf (Akkumulator, TECH-14). Die Logik kennt keine Fenstergröße und keine Bildrate.

## 7. Ordnerstruktur (nur Vorschlag, nicht angelegt)

```
frostbound/
  index.html                  Vite-Einstieg (ersetzt die bisherige Startseite)
  package.json
  tsconfig.json
  vite.config.ts              base: "/frostbound/"
  .github/workflows/pages.yml angepasst: npm ci, npm run build, dist veröffentlichen
  .github/workflows/ci.yml, publish.yml   CI und Testversionen (Stufe 0, TECH-24)
  scripts/publish-pages.sh                Veröffentlichung nach gh-pages (TECH-24)
  src/
    main.ts                   Modus aus URL, startet Phaser oder Selbsttest
    config.ts                 alle Werte (bestätigt, TECH, Testwerte getrennt)
    game/                     reine Logik, kein Phaser
      types.ts
      world.ts                createWorld, stepWorld
      player.ts
      spawning.ts
      enemies.ts
      combat.ts
      repair.ts
      roundEnd.ts
      stats.ts
    scenes/
      StartScene.ts
      GameScene.ts
      ResultScene.ts
      VisualsScene.ts         nur Testmodus
    view/
      WorldView.ts
      Hud.ts
    input/
      keyboard.ts
    tests/
      selftest.ts             Prüffunktionen ohne Framework
  docs/
```

Etwa 20 Dateien. Pakete: `phaser`, `typescript`, `vite`. Nichts weiter.

## 8. Konfiguration und Werte (`config.ts`)

Alle Werte stehen an genau einer Stelle (TECH-03). Gruppen: `CONFIRMED`, `LAYOUT` (TECH), `TESTWERTE`.

**CONFIRMED (Startwerte des Prototyps, D-053, D-052, D-056):**

| Wert | Inhalt |
|---|---|
| HP Lokomotive, Wagon, Geschütz | 100, 100, 20 |
| Schaden des Standardgegners | 10 |
| Reparaturschritt | 5 HP je 5000 ms |
| Seitenverhältnis | 16:9 |

**LAYOUT (TECH-01, TECH-08, TECH-09, TECH-10):** Spielfeld 1280 × 720 LE, Ursprung links oben, y nach unten. Zugbereich ab y = 620. Zugausrichtung (CONFIRMED, D-061): Der Zug fährt von links nach rechts, die Lokomotive steht ganz rechts, ihre Front zeigt nach rechts, alle Wagen stehen links von ihr (Konfigurationswert `trainFacing: "right"`). Rechtecke (x, y, Breite, Höhe): Wagon (340, 620, 280, 80), Lokomotive (660, 620, 280, 80), Geschütz auf der Wagon-Mitte (480, 640). Reparaturzonen direkt über dem jeweiligen Teil, nicht überlappend: Wagon (340, 560, 280, 60), Lokomotive (660, 560, 280, 60). Balance-Teststand 4: Höhe vorläufig 60 statt 120 (TESTWERT, vorher 340/660, y 500, Höhe 120); Teststand 3 mit versetzten Zonen ist zurückgenommen. Spielerstart (640, 360), Spielerradius 14 LE, begehbar y ≤ 620 − Radius. Gegner-Spawn y = −30, x gleichverteilt zwischen 40 und 1240.

**TESTWERTE (nicht bestätigt, D-045):**

| Wert | Vorschlag |
|---|---|
| Spielergeschwindigkeit | 240 LE/s |
| Spielerreichweite | 90 LE |
| Spielerschaden, Abkühlung | 1, 700 ms (Balance-Teststand 1, vorher 1000 ms) |
| Geschützschaden, Abkühlung | 1, 2500 ms (Balance-Teststand 1, vorher 1000 ms) |
| Reparaturschritt | 30 HP je 30000 ms (Balance-Teststand 6, vorläufig, 1 HP/s im Mittel; bestätigt ist 5 HP je 5000 ms, D-056, nicht aktiv) |
| Gegner-HP | 3 |
| Gegnertempo | 40 LE/s |
| Wellenpläne je Grad | siehe [../prototype/difficulty.md](../prototype/difficulty.md) |

## 9. Technische Entscheidungen (TECH)

Alle revidierbar, keine ändert eine bestätigte Gameplay-Regel.

| ID | Entscheidung |
|---|---|
| TECH-01 | Logisches Spielfeld 1280 × 720 LE (16:9). Keine Hindernisse. |
| TECH-02 | Zielplattform: aktueller Desktop-Browser mit Tastatur. Kein Touch. |
| TECH-03 | Darstellung skaliert per Phaser-Skalierung „FIT“ zentriert (mit Rand bei anderem Fensterverhältnis). Alle Werte stehen in `config.ts`. |
| TECH-04 | Eingabe als Richtungsvektor. Gegenläufige Tasten heben sich auf. |
| TECH-05 | Für das Geschütz ist ein Gegner „geeignet“, wenn er lebt und im Spielfeld ist (y ≥ 0). Bezugspunkt für „nächster“ ist die Geschützposition. Bei gleichem Abstand gewinnt die kleinere Gegner-ID. |
| TECH-06 | Angriffe sind Soforttreffer ohne Projektil. Die Darstellung zeigt eine kurze Linie. |
| TECH-07 | Die Zielwahl hat gleiche Wahrscheinlichkeit je intaktem Teil. Gegner sind Punkte. „Erreicht“ heißt: Punkt liegt im Rechteck des Zielteils. Der Gegner läuft auf die Rechteckmitte zu. |
| TECH-08 | Zuglayout wie in Abschnitt 8. Die Ausrichtung (Lokomotive ganz rechts, Front nach rechts, Wagen links) ist keine technische Wahl, sondern bestätigt (D-061). Der Zugbereich ist für den Spieler gesperrt. |
| TECH-09 | Reparaturzonen sind Rechtecke oberhalb des Zugbereichs über den Teilen (Teststand 4: 60 hoch), nicht überlappend. Bei überlappender Testkonfiguration wählt die Reihenfolge Wagon, Lokomotive. |
| TECH-10 | Spawn oberhalb des Spielfeldes. Eine Gruppe spawnt gleichzeitig, jeder Gegner mit eigener zufälliger x-Position. |
| TECH-11 | HUD-Inhalt: HP von Lokomotive und Wagon, Geschütz (HP oder „ZERSTÖRT“), Gegner „übrig / aktiv“ (noch nicht abgearbeitet / aktuell im Spielfeld), Schwierigkeitsgrad. Zerstörte Teile erscheinen rot (bei laufender Reparatur mit dem Stand, z. B. 35/100), beschädigte gelb. Die Leiste ist 32 LE hoch und halbtransparent, damit Gegner und Spieler am oberen Rand sichtbar bleiben. |
| TECH-12 | Start: Mausklick oder Taste 1/2/3, keine Voreinstellung. Ergebnis: Enter oder Klick. Der Schwierigkeitsgrad ändert nur die Wellenplan-Daten. |
| TECH-13 | Testmodi per URL-Parameter (`?mode=…`), Selbsttest ohne Framework, auch per Node ausführbar. |
| TECH-14 | Fester Zeitschritt 1000/60 ms, feste Schrittreihenfolge (Abschnitt 4). |
| TECH-15 | Zufall als injizierbare Funktion, kein Seed-System. |
| TECH-16 | Ereignisliste je Schritt für Darstellung und Statistik. |
| TECH-17 | Deployment: `vite build`, Veröffentlichung von `dist/` über den bestehenden GitHub-Pages-Workflow `pages.yml` (GitHub Actions). Seit Stufe 0 des erweiterten Prototyps zusätzlich vorbereitet: Veröffentlichung über den Branch `gh-pages` mit Testversionen, siehe TECH-24 und [deployment-and-previews.md](deployment-and-previews.md). Die Umstellung der Pages-Quelle ist noch nicht erfolgt. |
| TECH-18 | Angriffsablauf je Quelle (Schritt 7): Die Abkühlung zählt pro Schritt herunter. Ist sie ≤ 0 (mit 1e-6 ms Rundungstoleranz) und gibt es ein gültiges Ziel, erfolgt der Schuss und die Abkühlung wächst um das Intervall (der Rest wird mitgeführt, die mittlere Feuerrate ist bei jeder Schrittgröße gleich). Der erste Schuss fällt sofort, wenn ein Ziel vorhanden ist. Ohne Ziel bleibt die Quelle bereit (Abkühlung 0). Ein funktionsloses Geschütz hat Abkühlung 0 und ist nach der Reparatur sofort bereit. |
| TECH-19 | Gültiges Ziel für beide Quellen: lebender Gegner im sichtbaren Spielfeld (y ≥ 0). Der Spielerangriff nutzt zusätzlich die Reichweite (≤ 90 LE, Bezugspunkt Spielerposition). Innerhalb eines Schritts schlägt zuerst der Spieler zu, dann das Geschütz. Beide dürfen denselben Gegner treffen, der Kill geht an die Quelle des tödlichen Treffers. Bei gleichem Abstand gewinnt die kleinere Gegner-ID. |
| TECH-20 | Schrittreihenfolge: Kontakt und Zugschaden (Schritt 4) kommen vor den Angriffen (Schritt 5). Ein Gegner, der in einem Schritt sein Ziel erreicht, hat seinen Schaden angerichtet, bevor er beschossen wird. Trefferlinien bleiben 150 ms sichtbar (reine Anzeige). |
| TECH-21 | Reparatur (Schritt 8): Je Zugteil ein Fortschrittszähler in ms. Er wächst nur, solange der Spieler in der Zone des reparierbaren Teils steht (Position im Rechteck, Rand inklusive). Alle 5000 ms (mit 1e-6 ms Rundungstoleranz) kommen 5 HP hinzu, auch mehrere Schritte bei einem großen Zeitschritt. Beim Abschluss (HP = Maximum) endet der Status „zerstört“, der Zähler wird 0, und nur bei einem zuvor zerstörten Wagon wird das Geschütz auf 20/20 gesetzt und aktiviert (D-055). `world.activeRepair` nennt das in diesem Schritt reparierte Teil und dient der Darstellung (hervorgehobene Zone, Fortschrittsleiste). Die aktive Reparaturzeit wird je Teil in `stats.repairMsByPart` erfasst. |
| TECH-22 | Spielende (Schritt 9): `checkDefeat` läuft direkt nach Kontakt und Zugschaden (nach Schritt 4). Fällt das letzte intakte Teil, endet die Runde sofort, und in diesem Schritt folgen keine Angriffe oder Reparaturen mehr. Am Schrittende prüft `evaluateRoundEnd` zuerst die Niederlage, dann den Sieg. Der Statuswechsel setzt `status`, `stats.result` und genau ein Ereignis `roundEnded`. Danach ändert `stepWorld` nichts mehr. Die Szene zeigt nach dem Spielende 1,5 s lang das eingefrorene Spielfeld mit Banner „SIEG“ bzw. „NIEDERLAGE“ und wechselt dann einmalig zum Ergebnisbildschirm. Die Spieldauer ist die Simulationszeit `world.timeMs` (nur Anzeige). Ein Neustart ist der Weg Ergebnis → Start → Schwierigkeit wählen, jede Runde beginnt mit `createWorld` (D-047). |
| TECH-23 | Kennzeichnung von Testversionen (Stufe 0): `src/view/buildInfo.ts` zeigt als DOM-Overlay (ohne Phaser, ohne Einfluss auf Spiel und Szenen) "TESTVERSION · Branch · Commit", wenn der Build `VITE_BUILD_KIND=preview` erhält. Branch und Commit kommen aus `VITE_BUILD_BRANCH` und `VITE_BUILD_COMMIT` (Umgebungsvariablen beim Build). `main.ts` ruft `showBuildInfo()` in jedem Modus auf. |
| TECH-24 | Testversionen und Veröffentlichung (Stufe 0): Der Branch `gh-pages` enthält nur Build-Dateien (immer ein Commit). `main` schreibt die Wurzel, `feature/<name>` schreibt `preview/<name>/`. Der Ordnername entsteht aus dem Branch-Namen (kleingeschrieben, nur a-z, 0-9 und `-`, bei Änderung mit 6-stelligem Hash). Build mit `--base=/<repo>/preview/<name>/`. Schutzregeln, Parallelität, Aufräumen und Umstellungsablauf: [deployment-and-previews.md](deployment-and-previews.md). Die Veröffentlichung ist über die Repository-Variable `PAGES_MODE=branch` ein- und ausschaltbar. |

## 10. Anforderungen

### REQ-ARC-001 – Gameplay getrennt von Darstellung
- **Problemstellung:** Spiellogik darf nicht an Grafik oder Engine gebunden sein.
- **Ziel:** Gameplay läuft und ist testbar ohne Phaser und ohne Browser.
- **Gewünschtes Verhalten:** `game/` enthält alle Regeln. Die Darstellung liest den Zustand und zeichnet ihn.
- **Akzeptanzkriterien:** (1) Keine Datei in `game/` importiert Phaser, `scenes/`, `view/` oder `input/`. (2) `game/` nutzt keine Browser-APIs. (3) Der Selbsttest läuft in Node ohne Browser. (4) Der Datenfluss ist Gameplay → Darstellung, nicht umgekehrt. Eingaben kommen als Richtungsvektor.
- **Testfälle:** auto: Selbsttest in Node ausführen. Prüfung per Textsuche: kein Import von Phaser in `game/`.
- **Abhängigkeiten:** –
- **Entscheidungsstatus:** CONFIRMED (D-022); TECH (Form).

### REQ-ARC-002 – Szenen ohne Spiellogik
- **Problemstellung:** Szenen neigen dazu, Logik aufzunehmen.
- **Ziel:** Szenen sind dünne Verdrahtung.
- **Gewünschtes Verhalten:** Szenen erzeugen die Darstellung, leiten Eingaben weiter, rufen `stepWorld` mit festem Schritt auf, lesen den Zustand und wechseln Szenen.
- **Akzeptanzkriterien:** (1) Keine Spielregel (Schaden, Zielwahl, Spawn, Reparatur, Siegprüfung) in `scenes/` oder `view/`. (2) Ein Austausch der Szenen ändert kein Spielergebnis.
- **Testfälle:** auto: Alle Regeln sind im Selbsttest ohne Szene abgedeckt. Review: Szenencode enthält keine Regeln.
- **Abhängigkeiten:** REQ-ARC-001.
- **Entscheidungsstatus:** CONFIRMED (D-023).

### REQ-ARC-003 – Gameplay funktioniert mit Platzhaltern
- **Problemstellung:** Gameplay darf nicht von Grafiken abhängen.
- **Ziel:** Vollständig spielbar mit geometrischen Platzhaltern.
- **Gewünschtes Verhalten:** Jede Entität ist ohne Asset-Dateien darstellbar.
- **Akzeptanzkriterien:** (1) Keine Bild-, Ton- oder Schriftdateien nötig (Browserstandardschrift). (2) Ein späterer Austausch der Platzhalter ändert das Gameplay nicht.
- **Testfälle:** manuell: Prototyp ohne Asset-Ordner starten und durchspielen.
- **Abhängigkeiten:** testing-and-greybox.
- **Entscheidungsstatus:** CONFIRMED (D-024, D-006).

### REQ-ARC-004 – Zentrale Konfiguration
- **Problemstellung:** Viele Werte sind vorläufig und ändern sich nach Tests.
- **Ziel:** Alle Zahlenwerte stehen an einer Stelle.
- **Gewünschtes Verhalten:** `config.ts` enthält alle Werte in den Gruppen CONFIRMED, LAYOUT und TESTWERTE. Die Logik liest sie von dort bzw. bekommt sie bei `createWorld`.
- **Akzeptanzkriterien:** (1) Kein Zahlenwert mit Spielwirkung im Logikcode. (2) Die Gruppen sind klar getrennt und kommentiert. (3) Tests können eigene Werte übergeben. (4) Eine Wertänderung braucht keine Logikänderung.
- **Testfälle:** auto: Zwei Konfigurationen liefern bei gleicher Logik unterschiedliche Ergebnisse. Review: Suche nach Zahlenliteralen mit Spielwirkung.
- **Abhängigkeiten:** balance-and-statistics (REQ-BAL-001).
- **Entscheidungsstatus:** CONFIRMED (Prinzip, D-048); TECH (Form, D-060).

### REQ-ARC-005 – Auflösungsunabhängige Logik und 16:9
- **Problemstellung:** Alle Spieler brauchen gleiche Bedingungen.
- **Ziel:** Logik rechnet in LE, Darstellung skaliert proportional.
- **Gewünschtes Verhalten:** Die Logik kennt keine Pixel und keine Fenstergröße. Die Szene skaliert das 1280 × 720 große Spielfeld proportional.
- **Akzeptanzkriterien:** (1) `stepWorld` hat keinen Parameter für Bildschirmgröße. (2) Das Verhältnis ist 16:9. (3) Gleiche Eingaben liefern gleiche Ergebnisse bei beliebiger Fenstergröße.
- **Testfälle:** manuell: Fenster verschieden groß, Verhältnis und Inhalt bleiben gleich. Review: Signatur von `stepWorld`.
- **Abhängigkeiten:** core-gameplay (REQ-CORE-004).
- **Entscheidungsstatus:** CONFIRMED (D-058); TECH (Umsetzung).

### REQ-ARC-006 – Schlanke Architektur ohne Vorbereitung der Vollversion
- **Problemstellung:** Überdimensionierung verzögert den Prototyp.
- **Ziel:** So wenig Struktur wie nötig.
- **Gewünschtes Verhalten:** Nur die Module aus Abschnitt 7. Keine Plug-in-Systeme, keine allgemeinen Entity-Frameworks, keine Vorbereitung für zusätzliche Waggons, Geschütze, Gegnertypen oder Progression. Spätere Erweiterungen sollen nicht unmöglich sein, werden aber nicht vorbereitet.
- **Akzeptanzkriterien:** (1) Abhängigkeiten nur `phaser`, `typescript`, `vite`. (2) Keine Mechanismen für nicht im Prototyp enthaltene Inhalte. (3) Keine Entwickler-Dashboards.
- **Testfälle:** Review von `package.json` und der Dateiliste.
- **Abhängigkeiten:** –
- **Entscheidungsstatus:** CONFIRMED (D-059, D-060).

### REQ-ARC-007 – Nachvollziehbarer Spielschritt
- **Problemstellung:** Ergebnisse müssen reproduzierbar prüfbar sein, ohne Seed-System.
- **Ziel:** Gleiche Eingabefolge und gleiche Zufallsfunktion ergeben gleiche Ergebnisse.
- **Gewünschtes Verhalten:** `stepWorld` ist abhängig nur von Welt, Eingabe, Zeitschritt und der Zufallsfunktion der Welt.
- **Akzeptanzkriterien:** (1) Keine Nutzung von `Date`, `Math.random` oder globalem Zustand im Inneren von `game/` außer über `world.random`. (2) Zwei Läufe mit gleicher Zufallsfunktion und gleichen Eingaben liefern identische Zustände.
- **Testfälle:** auto: Zwei Läufe mit derselben festen Zufallsfunktion über N Schritte, Zustand gleich.
- **Abhängigkeiten:** testing-and-greybox (REQ-TST-003).
- **Entscheidungsstatus:** TECH (D-060).
