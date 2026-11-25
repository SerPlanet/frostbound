// Rundenende: Sieg und Niederlage (REQ-WL-002, REQ-WL-003, REQ-WL-005, D-050).
// Reine Logik: kein Phaser, keine Browser-APIs.
//
// - Niederlage: Alle Zugteile sind zerstört (ein Teil in Reparatur gilt bis zum Abschluss als zerstört).
//   Sie tritt im selben Schritt ein, in dem das letzte intakte Teil fällt, und hat Vorrang vor dem Sieg.
// - Sieg: Alle Gegner des Wellenplans sind gespawnt, kein Gegner ist mehr aktiv (jeder wurde besiegt
//   oder hat den Zug erreicht und ist verschwunden) und mindestens ein Zugteil ist intakt.
// - Der Statuswechsel passiert genau einmal. Danach ändert stepWorld nichts mehr (Einfrieren in world.ts).

import type { World } from "./types.ts";

function finish(world: World, result: "won" | "lost"): void {
  world.status = result;
  world.stats.result = result;
  world.events.push({ type: "roundEnded", result });
}

/**
 * Prüft die Niederlage und setzt sie bei Bedarf sofort. Gibt true zurück, wenn die Runde verloren ist.
 * stepWorld ruft das direkt nach Kontakt und Zugschaden auf, damit nach dem Fall des letzten
 * Zugteils in diesem Schritt keine Angriffe oder Reparaturen mehr stattfinden (TECH-22).
 */
export function checkDefeat(world: World): boolean {
  if (world.status === "running" && world.locomotive.destroyed && world.wagon.destroyed) {
    finish(world, "lost");
  }
  return world.status === "lost";
}

/** Prüft am Ende eines Schrittes zuerst die Niederlage, dann den Sieg. */
export function evaluateRoundEnd(world: World): void {
  if (world.status !== "running") return;
  if (checkDefeat(world)) return;

  const everythingSpawned = world.nextSpawnIndex >= world.spawnPlan.length;
  const noActiveEnemies = world.enemies.length === 0;
  const aPartIsIntact = !world.locomotive.destroyed || !world.wagon.destroyed;
  if (everythingSpawned && noActiveEnemies && aPartIsIntact) finish(world, "won");
}
