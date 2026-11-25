// Gegner-Spawning laut Wellenplan (REQ-ENM-001, REQ-ENM-007, REQ-CORE-002).
// Reine Logik: kein Phaser, keine Browser-APIs. Zufall nur über world.random.

import { LAYOUT, TESTWERTE } from "../config.ts";
import { chooseTarget } from "./enemies.ts";
import type { World } from "./types.ts";

/**
 * Erzeugt alle Gegner, deren Plan-Eintrag fällig ist (atMs <= timeMs).
 * Gegner erscheinen oberhalb des Spielfeldes (außerhalb des sichtbaren Bereichs) an einer
 * zufälligen x-Position, eine Gruppe gleichzeitig (TECH-10). Das Ziel wird unabhängig von
 * der Position gewählt. Es gibt genau einen Gegnertyp (D-038).
 */
export function spawnEnemies(world: World): void {
  const span = LAYOUT.enemySpawnXMax - LAYOUT.enemySpawnXMin;
  while (world.nextSpawnIndex < world.spawnPlan.length && world.spawnPlan[world.nextSpawnIndex].atMs <= world.timeMs) {
    const entry = world.spawnPlan[world.nextSpawnIndex];
    world.nextSpawnIndex++;
    for (let i = 0; i < entry.count; i++) {
      const x = LAYOUT.enemySpawnXMin + world.random() * span;
      world.enemies.push({
        id: world.nextEnemyId++,
        x,
        y: LAYOUT.enemySpawnY,
        hp: TESTWERTE.enemy.hp,
        target: chooseTarget(world),
      });
      world.stats.spawned++;
    }
  }
}
