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
  // Reparatur: 5 HP alle 5 Sekunden (D-056)
  repairStepHp: 5,
  repairStepMs: 5000,
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
  wagonZone: { x: 340, y: 500, w: 280, h: 120 },
  locomotiveZone: { x: 660, y: 500, w: 280, h: 120 },
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
  player: { damage: 1, cooldownMs: 1000 },
  turret: { damage: 1, cooldownMs: 1000 },
  enemy: { hp: 3, speed: 40 },
  waves: {
    gemuetlich: {
      singles: { count: 3, startSec: 3, intervalSec: 6 },
      groups: { count: 4, size: 3, startSec: 30, intervalSec: 8 },
      wave: { count: 10, perSecond: 1, startSec: 75 },
    },
    normal: {
      singles: { count: 5, startSec: 3, intervalSec: 6 },
      groups: { count: 5, size: 3, startSec: 40, intervalSec: 8 },
      wave: { count: 20, perSecond: 2, startSec: 95 },
    },
    winterhart: {
      singles: { count: 6, startSec: 3, intervalSec: 5 },
      groups: { count: 6, size: 4, startSec: 36, intervalSec: 7 },
      wave: { count: 30, perSecond: 3, startSec: 100 },
    },
  } as Record<Difficulty, WavePlanConfig>,
};
