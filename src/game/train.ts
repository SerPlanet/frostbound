// Zugteile: Schaden, Zerstörung und Wagon-Geschütz-Abhängigkeit (REQ-TRN-003 bis REQ-TRN-005).
// Reine Logik: kein Phaser, keine Browser-APIs. Reparatur folgt in einem späteren Schritt.
// Diese Funktionen werden von späteren Systemen aufgerufen (Gegnerkontakt, Tests); sie
// beenden die Runde nicht (Sieg und Niederlage folgen in Schritt 9).

import type { PartId, TrainPart, World } from "./types.ts";

export type PartCondition = "intact" | "damaged" | "destroyed";

/**
 * Zustand eines Zugteils: zerstört (Status `destroyed`, bleibt bis zum Reparaturabschluss,
 * auch wenn die HP währenddessen steigen), beschädigt (HP unter dem Maximum) oder intakt.
 */
export function getPartCondition(part: Pick<TrainPart, "hp" | "maxHp" | "destroyed">): PartCondition {
  if (part.destroyed) return "destroyed";
  return part.hp < part.maxHp ? "damaged" : "intact";
}

/** Das Geschütz sitzt auf dem Wagon: Mit dem Wagon ist auch das Geschütz zerstört (D-055). */
function destroyTurret(world: World): void {
  const turret = world.turret;
  if (turret.destroyed) return;
  turret.hp = 0; // der vorherige Zustand ist irrelevant, die Reparatur setzt es auf 20/20
  turret.destroyed = true;
  world.events.push({ type: "turretDestroyed" });
}

/**
 * Fügt einem Zugteil (Lokomotive oder Wagon) Schaden zu und gibt den tatsächlich
 * angewendeten Schaden zurück.
 * - HP sinken nie unter 0. Bei 0 HP wird das Teil zerstört (Ereignis `partDestroyed`).
 * - Wird der Wagon zerstört, ist auch das Geschütz zerstört.
 * - Ein bereits zerstörtes Teil nimmt keinen Schaden mehr (es ist kein gültiges Ziel, D-039):
 *   HP, Status, Statistik und Ereignisse bleiben unverändert.
 * - Schaden kleiner oder gleich 0 sowie ungültige Werte (NaN) werden ignoriert.
 */
export function damageTrainPart(world: World, id: PartId, amount: number): number {
  const part = id === "locomotive" ? world.locomotive : world.wagon;
  if (!(amount > 0) || part.destroyed) return 0;

  const applied = Math.min(amount, part.hp);
  part.hp -= applied;
  world.stats.damageByPart[id] += applied;

  if (part.hp <= 0) {
    part.hp = 0;
    part.destroyed = true;
    world.events.push({ type: "partDestroyed", part: id });
    if (id === "wagon") destroyTurret(world);
  }
  return applied;
}

/**
 * Fügt dem Geschütz Schaden zu und gibt den angewendeten Schaden zurück.
 * Der Wagon bleibt davon unabhängig. Im Prototyp greift kein System das Geschütz an
 * (D-053, D-055), die Funktion ist für Tests und spätere Erweiterungen vorhanden.
 */
export function damageTurret(world: World, amount: number): number {
  const turret = world.turret;
  if (!(amount > 0) || turret.destroyed) return 0;

  const applied = Math.min(amount, turret.hp);
  turret.hp -= applied;
  if (turret.hp <= 0) {
    turret.hp = 0;
    turret.destroyed = true;
    world.events.push({ type: "turretDestroyed" });
  }
  return applied;
}
