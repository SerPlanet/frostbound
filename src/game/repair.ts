// Reparatur (REQ-REP-001 bis REQ-REP-006, REQ-PLR-003, D-043, D-056).
// Reine Logik: kein Phaser, keine Browser-APIs. Reparaturen kosten nichts.
//
// - Der Spieler repariert ein Zugteil, solange er in dessen Reparaturzone steht und das Teil
//   repariert werden kann (beschädigt oder zerstört). Es gibt keine Taste dafür.
// - Je Teil läuft ein Fortschrittszähler. Nach TESTWERTE.repairStepMs Anwesenheit kommen auf einmal TESTWERTE.repairStepHp HP hinzu (Teststand 6: 30 HP nach 30000 ms, bestätigt: 5 HP nach 5000 ms, D-056).
//   Verlässt der Spieler die Zone, bleibt der Zählerstand erhalten und läuft später weiter.
// - Nur ein Teil gleichzeitig. Überlappen Zonen (im Prototyp nicht), gilt die Reihenfolge
//   Wagon, Lokomotive (TECH-09).
// - Ein zerstörtes Teil bleibt zerstört, bis die HP wieder das Maximum erreichen (Abschluss).
//   Wird ein zerstörter Wagon abgeschlossen, ist auch das Geschütz wieder intakt (20/20)
//   und bereit (D-055). Ein nur beschädigter Wagon lässt das Geschütz unberührt.
// - Die Reparatur läuft unabhängig vom Spielerangriff weiter (combat.ts wird nicht beeinflusst).

import { TESTWERTE } from "../config.ts";
import { getPartCondition } from "./train.ts";
import type { Rect, TrainPart, World } from "./types.ts";

// Rundungstoleranz in ms (siehe combat.ts): Ein fälliger Schritt darf nicht an Gleitkommaresten scheitern.
const STEP_EPSILON_MS = 1e-6;

function inRect(x: number, y: number, r: Rect): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function isRepairable(part: TrainPart): boolean {
  return getPartCondition(part) !== "intact";
}

/** Setzt ein vollständig repariertes Teil wieder in Betrieb. */
function completeRepair(world: World, part: TrainPart): void {
  const wasDestroyed = part.destroyed;
  part.hp = part.maxHp;
  part.destroyed = false;
  part.repairProgressMs = 0;
  world.events.push({ type: "partRepaired", part: part.id });

  if (part.id === "wagon" && wasDestroyed) {
    // Wagon und Geschütz werden gemeinsam wiederhergestellt, der frühere Zustand ist irrelevant.
    world.turret.hp = world.turret.maxHp;
    world.turret.destroyed = false;
    world.turret.attackCooldownMs = 0;
  }
}

/** Führt die Reparatur für einen Zeitschritt aus. */
export function updateRepair(world: World, dtMs: number): void {
  world.activeRepair = null;

  const { x, y } = world.player;
  const part = [world.wagon, world.locomotive].find((p) => isRepairable(p) && inRect(x, y, p.zone));
  if (!part) return;

  world.activeRepair = part.id;
  world.stats.repairMsByPart[part.id] += dtMs;
  part.repairProgressMs += dtMs;

  while (part.repairProgressMs >= TESTWERTE.repairStepMs - STEP_EPSILON_MS && part.hp < part.maxHp) {
    part.repairProgressMs = Math.max(0, part.repairProgressMs - TESTWERTE.repairStepMs);
    part.hp = Math.min(part.maxHp, part.hp + TESTWERTE.repairStepHp);
  }

  if (part.hp >= part.maxHp) completeRepair(world, part);
}
