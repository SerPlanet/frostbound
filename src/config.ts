// Zentrale Konfiguration (REQ-ARC-004, TECH-03). Alle Zahlenwerte mit Gameplay-Wirkung stehen hier.
// Drei Gruppen, siehe docs/technical/architecture.md, Abschnitt 8:
//   CONFIRMED  vom Projektverantwortlichen bestätigte Startwerte des Prototyps
//   LAYOUT     technische Spielfeld-, Positions- und Zeitschrittwerte (TECH-Entscheidungen, revidierbar)
//   TESTWERTE  vorläufige Gameplay-Werte, im Spieltest anzupassen (D-045), nicht bestätigt
// Logische Einheiten (LE): Spielfeld 1280 x 720, Ursprung links oben, y nach unten.

import type { Difficulty } from "./game/types.ts";

// ---------------------------------------------------------------- CONFIRMED
export const CONFIRMED = {
  // Lebenspunkte (D-053)
  hp: { locomotive: 100, wagon: 100, turret: 20 },
  // Schaden des Standardgegners, unabhängig vom getroffenen Zugteil (D-052)
  enemyDamage: 10,
  // Reparatur: Schrittgröße 5 HP (D-056). Die bestätigte Schrittdauer (5000 ms, also 1 HP/s) ist
  // vorübergehend durch den Testwert TESTWERTE.repairStepMs überlagert, siehe dort.
  repairStepHp: 5,
  // Seitenverhältnis des Spielfeldes (D-058)
  aspect: { w: 16, h: 9 },
};

// ---------------------------------------------------------------- LAYOUT (TECH)
export const LAYOUT = {
  // TECH-01
  field: { width: 1280, height: 720 },
  // TECH-08: Zugbereich ab dieser y-Position, für den Spieler gesperrt
  trainTopY: 620,
  // Zugausrichtung (CONFIRMED, D-061, gilt für das gesamte Spiel): Der Zug fährt von links nach
  // rechts. Die Lokomotive steht ganz rechts, ihre Front zeigt nach rechts (Fahrtrichtung).
  // Alle Wagen stehen links von der Lokomotive, weitere Wagen kämen links dazu.
  trainFacing: "right" as "left" | "right",
  wagonRect: { x: 340, y: 620, w: 280, h: 80 },
  locomotiveRect: { x: 660, y: 620, w: 280, h: 80 },
  // Geschütz auf der Wagon-Mitte
  turretPos: { x: 480, y: 640 },
  // TECH-09: Reparaturzonen direkt über den Teilen, nicht überlappend
  // Balance-Teststand 4 (TESTWERT, vorläufig): Lage und Länge wie im Ursprungslayout (Wagon x 340 bis 620,
  // Lokomotive x 660 bis 940, je 280 lang), aber nur noch 60 hoch statt 120 (y 560 bis 620, unten bündig
  // mit dem Zugbereich). Der Teststand 3 mit versetzten, 140 breiten Zonen ist damit zurückgenommen.
  wagonZone: { x: 340, y: 560, w: 280, h: 60 },
  locomotiveZone: { x: 660, y: 560, w: 280, h: 60 },
  playerStart: { x: 640, y: 360 },
  playerRadius: 14,
  // TECH-10: Gegner-Spawn oberhalb des Spielfeldes
  enemySpawnY: -30,
  enemySpawnXMin: 40,
  enemySpawnXMax: 1240,
  // TECH-14: fester Zeitschritt in Millisekunden
  stepMs: 1000 / 60,
  // Längste Frame-Zeit, die pro Bild in Simulationsschritte umgesetzt wird (verhindert Aufholschleifen)
  maxFrameMs: 100,
  // Darstellung: Wie lange eine Trefferlinie sichtbar bleibt (nur Anzeige, keine Spielwirkung)
  shotDisplayMs: 150,
  // Darstellung: Pause zwischen Spielende (eingefrorenes Spielfeld mit Ergebnis-Banner) und Ergebnisbildschirm
  resultDelayMs: 1500,
};

// ---------------------------------------------------------------- TESTWERTE
// Wellenplan je Schwierigkeitsgrad, siehe docs/prototype/difficulty.md.
// Zeiten in Sekunden ab Rundenstart. Verlauf: einzelne Gegner, kleine Gruppen, große Welle.
export interface WavePlanConfig {
  singles: { count: number; startSec: number; intervalSec: number };
  groups: { count: number; size: number; startSec: number; intervalSec: number };
  wave: { count: number; perSecond: number; startSec: number };
}

export const TESTWERTE = {
  playerSpeed: 240,
  playerRange: 90,
  // Balance-Teststand 1: Angriffsintervalle (vorher je 1000 ms)
  player: { damage: 1, cooldownMs: 700 },
  turret: { damage: 1, cooldownMs: 2500 },
  // Balance-Teststand 2: Reparaturschritt (5 HP je 3333 ms = 1,5 HP/s). VORLÄUFIGER TESTWERT.
  // (Teststand 1 hatte 2500 ms = 2 HP/s.)
  // Die bestätigte Regel D-056 lautet 5 HP je 5000 ms (1 HP/s, 0 auf 100 HP in 100 s). Sie ist nicht
  // geändert, nur im Spieltest überlagert. Für den Rückweg auf den bestätigten Wert: 5000.
  repairStepMs: 3333,
  enemy: { hp: 3, speed: 40 },
  waves: {
    gemuetlich: {
      singles: { count: 3, startSec: 3, intervalSec: 6 },
      groups: { count: 10, size: 3, startSec: 25, intervalSec: 5 },
      wave: { count: 14, perSecond: 2, startSec: 85 },
    },
    normal: {
      singles: { count: 4, startSec: 3, intervalSec: 6 },
      groups: { count: 10, size: 3, startSec: 26, intervalSec: 5 },
      wave: { count: 22, perSecond: 1, startSec: 91 },
    },
    winterhart: {
      singles: { count: 5, startSec: 3, intervalSec: 5 },
      groups: { count: 12, size: 3, startSec: 26, intervalSec: 5 },
      wave: { count: 22, perSecond: 1, startSec: 91 },
    },
  } as Record<Difficulty, WavePlanConfig>,
};
