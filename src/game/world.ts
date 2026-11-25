// Erzeugung und Aktualisierung der Spielwelt (docs/technical/architecture.md, Abschnitte 3 und 4).
// Reine Logik: kein Phaser, keine Browser-APIs. Zufall nur über world.random.

import { CONFIRMED, LAYOUT, TESTWERTE } from "../config.ts";
import type { WavePlanConfig } from "../config.ts";
import { runCombat } from "./combat.ts";
import { moveEnemies, resolveEnemyContacts } from "./enemies.ts";
import { movePlayer } from "./player.ts";
import { updateRepair } from "./repair.ts";
import { checkDefeat, evaluateRoundEnd } from "./roundEnd.ts";
import { spawnEnemies } from "./spawning.ts";
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
    activeRepair: null,
    random,
  };
}

/**
 * Bringt die Welt um einen festen Zeitschritt voran.
 * Ist der Status nicht `running`, bleibt die Welt unverändert (REQ-WL-005).
 *
 * Schrittreihenfolge der Systeme (TECH-14). Alle Systeme sind umgesetzt:
 *   1 player.ts     Spieler bewegen (umgesetzt)
 *   2 spawning.ts   Gegner laut Wellenplan erzeugen (umgesetzt)
 *   3 enemies.ts    Gegner bewegen (umgesetzt)
 *   4 enemies.ts    Kontakt, Schaden, Zerstörung, Zielneuwahl (umgesetzt)
 *   5 combat.ts     Spieler- und Geschützangriff (umgesetzt)
 *   6 repair.ts     Reparatur (umgesetzt)
 *   7 roundEnd.ts   Niederlage vor Sieg prüfen (umgesetzt; die Niederlage zusätzlich schon direkt nach Schritt 4)
 *   8 stats.ts      Statistik: Zähler werden von den Systemen fortgeschrieben, stats.ts fasst sie zusammen (umgesetzt)
 */
export function stepWorld(world: World, input: PlayerInput, dtMs: number): void {
  if (world.status !== "running") return;

  // Ereignisse gelten nur für den aktuellen Schritt.
  world.events.length = 0;
  world.timeMs += dtMs;

  // 1 Spieler bewegen
  movePlayer(world, input, dtMs);

  // 2 Gegner laut Wellenplan erzeugen
  spawnEnemies(world);

  // 3 Gegner bewegen
  moveEnemies(world, dtMs);

  // 4 Kontakt, Schaden, Zerstörung, Zielneuwahl
  resolveEnemyContacts(world);

  // Niederlage sofort: Fällt das letzte intakte Zugteil, finden in diesem Schritt keine Angriffe
  // oder Reparaturen mehr statt, und die Niederlage hat Vorrang vor jedem Sieg (D-050).
  if (checkDefeat(world)) return;

  // 5 Spieler- und Geschützangriff
  runCombat(world, dtMs);

  // 6 Reparatur
  updateRepair(world, dtMs);

  // 7 Rundenende: Niederlage vor Sieg prüfen. Die Statistik (8) wird von den Systemen
  // laufend fortgeschrieben, siehe stats.ts für die Zusammenfassung.
  evaluateRoundEnd(world);
}
