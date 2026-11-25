// Automatische Angriffe von Spieler und Zuggeschütz (REQ-CMB-001 bis REQ-CMB-005).
// Reine Logik: kein Phaser, keine Browser-APIs. Soforttreffer ohne Projektil (TECH-06).
//
// Ablauf je Quelle und Schritt (TECH-18, bildratenunabhängig):
//   Abkühlung -= dtMs. Ist sie <= 0 (mit minimaler Rundungstoleranz) und gibt es ein gültiges Ziel, schlägt die Quelle zu und
//   die Abkühlung wird um das Angriffsintervall erhöht (der Rest wird mitgeführt, die mittlere
//   Feuerrate bleibt bei jeder Schrittgröße gleich). Ohne Ziel bleibt die Quelle bereit.
// Gültiges Ziel (TECH-05, TECH-19): lebender Gegner im sichtbaren Spielfeld.
//   Spieler: nächster Gegner innerhalb seiner Reichweite, Bezugspunkt Spielerposition.
//   Geschütz: nächster Gegner im gesamten Spielfeld, Bezugspunkt Geschützposition,
//   nur solange das Geschütz funktionsfähig ist (Wagon nicht zerstört, D-055).
//   Bei gleichem Abstand gewinnt die kleinere Gegner-ID.
// Reihenfolge innerhalb eines Schritts: erst der Spielerangriff, dann das Geschütz. Beide dürfen
// denselben Gegner treffen. Die Quelle des tödlichen Treffers erhält den Kill (TECH-19).

import { LAYOUT, TESTWERTE } from "../config.ts";
import type { AttackSource, Enemy, World } from "./types.ts";

// Rundungstoleranz in ms: Gleitkommareste beim Herunterzählen dürfen einen fälligen Schuss
// nicht um einen ganzen Schritt verzögern (sonst sänke die Feuerrate bei manchen Schrittgrößen).
const READY_EPSILON_MS = 1e-6;

function inField(enemy: Enemy): boolean {
  return enemy.x >= 0 && enemy.x <= LAYOUT.field.width && enemy.y >= 0 && enemy.y <= LAYOUT.field.height;
}

/** Nächster gültiger Gegner zu einem Punkt, optional begrenzt durch eine Reichweite (<=). */
export function nearestEnemy(world: World, fromX: number, fromY: number, maxDistance: number = Infinity): Enemy | null {
  let best: Enemy | null = null;
  let bestDistance = Infinity;
  for (const enemy of world.enemies) {
    if (enemy.hp <= 0 || !inField(enemy)) continue;
    const distance = Math.hypot(enemy.x - fromX, enemy.y - fromY);
    if (distance > maxDistance) continue;
    if (distance < bestDistance || (distance === bestDistance && best !== null && enemy.id < best.id)) {
      best = enemy;
      bestDistance = distance;
    }
  }
  return best;
}

/** Das Geschütz arbeitet nur, wenn es selbst und sein Wagon nicht zerstört sind (D-055). */
export function isTurretFunctional(world: World): boolean {
  return !world.turret.destroyed && !world.wagon.destroyed;
}

/** Trifft einen Gegner sofort. Bei 0 Lebenspunkten wird er entfernt und der Quelle als besiegt gezählt. */
function strike(world: World, source: AttackSource, fromX: number, fromY: number, enemy: Enemy, damage: number): void {
  enemy.hp -= damage;
  world.events.push({ type: "shot", source, fromX, fromY, toX: enemy.x, toY: enemy.y });
  if (enemy.hp > 0) return;

  enemy.hp = 0;
  world.enemies = world.enemies.filter((e) => e !== enemy);
  if (source === "player") world.stats.killsByPlayer++;
  else world.stats.killsByTurret++;
  world.events.push({ type: "enemyDefeated", enemyId: enemy.id, source });
}

/** Führt die beiden unabhängigen Angriffsquellen für einen Zeitschritt aus. */
export function runCombat(world: World, dtMs: number): void {
  // Spielerangriff (D-036): nächster Gegner innerhalb der begrenzten Reichweite, Einzelziel.
  const player = world.player;
  player.attackCooldownMs -= dtMs;
  if (player.attackCooldownMs <= READY_EPSILON_MS) {
    const target = nearestEnemy(world, player.x, player.y, TESTWERTE.playerRange);
    if (target) {
      strike(world, "player", player.x, player.y, target, TESTWERTE.player.damage);
      player.attackCooldownMs += TESTWERTE.player.cooldownMs;
    } else {
      player.attackCooldownMs = 0;
    }
  }

  // Geschützangriff (D-037): gesamtes Spielfeld, nur wenn funktionsfähig.
  const turret = world.turret;
  if (!isTurretFunctional(world)) {
    turret.attackCooldownMs = 0;
    return;
  }
  turret.attackCooldownMs -= dtMs;
  if (turret.attackCooldownMs <= READY_EPSILON_MS) {
    const target = nearestEnemy(world, turret.x, turret.y);
    if (target) {
      // Die Trefferlinie beginnt an der Mündung des Geschützes.
      strike(world, "turret", turret.x, turret.y - 34, target, TESTWERTE.turret.damage);
      turret.attackCooldownMs += TESTWERTE.turret.cooldownMs;
    } else {
      turret.attackCooldownMs = 0;
    }
  }
}
