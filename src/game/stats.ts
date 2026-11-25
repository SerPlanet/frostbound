// Rundenstatistik (REQ-STA-001, D-048): Die Zähler werden von den Systemen während der Runde
// fortgeschrieben (spawning, combat, enemies, repair). Diese Datei fasst sie am Rundenende zusammen.
// Reine Logik: kein Phaser, keine Browser-APIs.

import type { Difficulty, GameStatus, World } from "./types.ts";

export interface RoundSummary {
  result: GameStatus;
  difficulty: Difficulty;
  /** Spieldauer in Millisekunden (Simulationszeit, nur Anzeige, nicht Grundlage des Erfolgs, D-031). */
  durationMs: number;
  /** Anzahl aller im Wellenplan vorgesehenen Gegner. */
  plannedEnemies: number;
  spawned: number;
  defeatedByPlayer: number;
  defeatedByTurret: number;
  reachedTrain: number;
  damageLocomotive: number;
  damageWagon: number;
  repairMsLocomotive: number;
  repairMsWagon: number;
}

/** Fasst den aktuellen Weltzustand zur Anzeige auf dem Ergebnisbildschirm zusammen (nur Lesezugriff). */
export function getRoundSummary(world: World): RoundSummary {
  const s = world.stats;
  return {
    result: world.status,
    difficulty: world.difficulty,
    durationMs: world.timeMs,
    plannedEnemies: world.spawnPlan.reduce((sum, entry) => sum + entry.count, 0),
    spawned: s.spawned,
    defeatedByPlayer: s.killsByPlayer,
    defeatedByTurret: s.killsByTurret,
    reachedTrain: s.reachedTrain,
    damageLocomotive: s.damageByPart.locomotive,
    damageWagon: s.damageByPart.wagon,
    repairMsLocomotive: s.repairMsByPart.locomotive,
    repairMsWagon: s.repairMsByPart.wagon,
  };
}
