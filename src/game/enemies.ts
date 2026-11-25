// Gegner: Zielwahl, Bewegung, Zielwechsel, Erreichen des Zuges (REQ-ENM-002 bis REQ-ENM-008).
// Reine Logik: kein Phaser, keine Browser-APIs. Zufall nur über world.random (TECH-15).

import { CONFIRMED, TESTWERTE } from "../config.ts";
import { damageTrainPart } from "./train.ts";
import type { Enemy, PartId, Rect, TrainPart, World } from "./types.ts";

function partOf(world: World, id: PartId): TrainPart {
  return id === "locomotive" ? world.locomotive : world.wagon;
}

function inRect(x: number, y: number, r: Rect): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

/**
 * Wählt zufällig eines der verfügbaren intakten Zugteile (Lokomotive, Wagon) als Ziel
 * (D-051). Gleiche Wahrscheinlichkeit je intaktem Teil (TECH-07). Das Geschütz ist nie
 * ein Ziel, zerstörte Teile auch nicht, selbst wenn sie gerade repariert werden (D-039).
 * Gibt `null` zurück, wenn kein Teil intakt ist (das Spiel ist dann bereits verloren).
 * Die Spawnposition geht nicht ein.
 */
export function chooseTarget(world: World): PartId | null {
  const intact = [world.locomotive, world.wagon].filter((part) => !part.destroyed);
  if (intact.length === 0) return null;
  const index = Math.min(Math.floor(world.random() * intact.length), intact.length - 1);
  return intact[index].id;
}

/**
 * Bewegt alle Gegner mit konstanter Geschwindigkeit geradlinig auf die Mitte ihres
 * Zielteils (kürzester Weg). Kein Ausweichen, keine Wechselwirkung mit Spieler oder
 * anderen Gegnern (D-035, D-040). Gegner ohne Ziel bleiben stehen.
 */
export function moveEnemies(world: World, dtMs: number): void {
  const step = (TESTWERTE.enemy.speed * dtMs) / 1000;
  for (const enemy of world.enemies) {
    // Ein zwischen zwei Schritten zerstörtes Ziel wird vor der Bewegung ersetzt.
    if (enemy.target === null || partOf(world, enemy.target).destroyed) enemy.target = chooseTarget(world);
    if (enemy.target === null) continue;
    const rect = partOf(world, enemy.target).rect;
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const dx = cx - enemy.x;
    const dy = cy - enemy.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= step) {
      enemy.x = cx;
      enemy.y = cy;
    } else {
      enemy.x += (dx / distance) * step;
      enemy.y += (dy / distance) * step;
    }
  }
}

/**
 * Prüft Ziele und Kontakt (REQ-ENM-003, REQ-ENM-006, REQ-ENM-008):
 * - Ist das Ziel eines Gegners zerstört, wählt er sofort ein neues intaktes Ziel.
 * - Erreicht ein Gegner sein Zielteil (Position im Rechteck), verursacht er einmalig
 *   10 Schaden über damageTrainPart, wird entfernt und als „Zug erreicht“ gezählt.
 * - Werden dabei weitere Teile zerstört, wechseln alle betroffenen Gegner noch im selben Schritt.
 */
export function resolveEnemyContacts(world: World): void {
  const remaining: Enemy[] = [];
  for (const enemy of world.enemies) {
    if (enemy.target === null || partOf(world, enemy.target).destroyed) {
      enemy.target = chooseTarget(world);
    }
    if (enemy.target !== null && inRect(enemy.x, enemy.y, partOf(world, enemy.target).rect)) {
      damageTrainPart(world, enemy.target, CONFIRMED.enemyDamage);
      world.stats.reachedTrain++;
      world.events.push({ type: "enemyReachedTrain", enemyId: enemy.id, part: enemy.target });
      continue; // verschwindet nach dem einmaligen Schaden
    }
    remaining.push(enemy);
  }
  world.enemies = remaining;

  // Ein Teil kann durch einen späteren Gegner dieses Schrittes zerstört worden sein.
  for (const enemy of world.enemies) {
    if (enemy.target !== null && partOf(world, enemy.target).destroyed) {
      enemy.target = chooseTarget(world);
    }
  }
}
