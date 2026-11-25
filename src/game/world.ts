// Erzeugung und Aktualisierung der Spielwelt (docs/technical/architecture.md, Abschnitte 3 und 4).
// Reine Logik: kein Phaser, keine Browser-APIs. Zufall nur über world.random.

import { CONFIRMED, LAYOUT, TESTWERTE } from "../config.ts";
import type { WavePlanConfig } from "../config.ts";
import type { Difficulty, PlayerInput, SpawnEntry, TrainPart, World } from "./types.ts";

/** Baut den Wellenplan aus der Konfiguration: einzelne Gegner, kleine Gruppen, große Welle. */
function buildSpawnPlan(cfg: WavePlanConfig): SpawnEntry[] {
  const plan: SpawnEntry[] = [];
  for (let i = 0; i < cfg.singles.count; i++) {
    plan.push({ atMs: (cfg.singles.startSec + i * cfg.singles.intervalSec) * 1000, count: 1 });
  }
  for (let i = 0; i < cfg.groups.count; i++) {
    plan.push({ atMs: (cfg.groups.startSec + i * cfg.groups.intervalSec) * 1000, count: cfg.groups.size });
  }
  const waveSteps = Math.floor(cfg.wave.count / cfg.wave.perSecond);
  for (let i = 0; i < waveSteps; i++) {
    plan.push({ atMs: (cfg.wave.startSec + i) * 1000, count: cfg.wave.perSecond });
  }
  return plan.sort((a, b) => a.atMs - b.atMs);
}

function createPart(
  id: TrainPart["id"],
  rect: TrainPart["rect"],
  zone: TrainPart["zone"],
  maxHp: number,
): TrainPart {
  return { id, rect: { ...rect }, zone: { ...zone }, hp: maxHp, maxHp, destroyed: false, repairProgressMs: 0 };
}

/**
 * Erzeugt eine vollständig neue Spielwelt (Status running, leere Gegnerliste,
 * Lokomotive 100 HP, Wagon 100 HP, Geschütz 20 HP auf dem Wagon).
 * `random` ist die austauschbare Zufallsfunktion, Standard ist Math.random (TECH-15).
 */
export function createWorld(difficulty: Difficulty, random: () => number = Math.random): World {
  return {
    status: "running",
    difficulty,
    timeMs: 0,
    player: {
      x: LAYOUT.playerStart.x,
      y: LAYOUT.playerStart.y,
      attackCooldownMs: 0,
    },
    locomotive: createPart("locomotive", LAYOUT.locomotiveRect, LAYOUT.locomotiveZone, CONFIRMED.hp.locomotive),
    wagon: createPart("wagon", LAYOUT.wagonRect, LAYOUT.wagonZone, CONFIRMED.hp.wagon),
    turret: {
      x: LAYOUT.turretPos.x,
      y: LAYOUT.turretPos.y,
      hp: CONFIRMED.hp.turret,
      maxHp: CONFIRMED.hp.turret,
      destroyed: false,
      attackCooldownMs: 0,
    },
    enemies: [],
    spawnPlan: buildSpawnPlan(TESTWERTE.waves[difficulty]),
    nextSpawnIndex: 0,
    nextEnemyId: 1,
    stats: {
      spawned: 0,
      killsByPlayer: 0,
      killsByTurret: 0,
      reachedTrain: 0,
      damageByPart: { locomotive: 0, wagon: 0 },
      repairMsByPart: { locomotive: 0, wagon: 0 },
      result: "running",
    },
    events: [],
    random,
  };
}

/**
 * Bringt die Welt um einen festen Zeitschritt voran.
 * Ist der Status nicht `running`, bleibt die Welt unverändert (REQ-WL-005).
 *
 * Schrittreihenfolge der späteren Systeme (TECH-14), hier noch nicht implementiert:
 *   1 player.ts     Spieler bewegen
 *   2 spawning.ts   Gegner laut Wellenplan erzeugen
 *   3 enemies.ts    Gegner bewegen
 *   4 enemies.ts    Kontakt, Schaden, Zerstörung, Zielneuwahl
 *   5 combat.ts     Spieler- und Geschützangriff
 *   6 repair.ts     Reparatur
 *   7 roundEnd.ts   Niederlage vor Sieg prüfen
 *   8 stats.ts      Statistik fortschreiben
 */
export function stepWorld(world: World, input: PlayerInput, dtMs: number): void {
  if (world.status !== "running") return;

  // Ereignisse gelten nur für den aktuellen Schritt.
  world.events.length = 0;
  world.timeMs += dtMs;

  // Noch keine Systeme: Die Eingabe wird erst ab Schritt 4 der Umsetzung ausgewertet.
  void input;
}
