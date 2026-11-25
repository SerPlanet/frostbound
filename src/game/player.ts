// Spielerbewegung (REQ-PLR-001, REQ-PLR-004, REQ-PLR-005, D-057).
// Reine Logik: kein Phaser, keine Browser-APIs.

import { LAYOUT, TESTWERTE } from "../config.ts";
import type { PlayerInput, World } from "./types.ts";

/**
 * Bewegt den Spieler um einen Zeitschritt.
 * - Feste Geschwindigkeit, auch diagonal gleich schnell (Richtungsvektor wird normiert).
 * - Bewegung hängt nur von der Schrittdauer ab, nicht von der Bildrate.
 * - Begrenzung auf das sichtbare Spielfeld ohne den Zugbereich. Läuft der Spieler gegen eine
 *   Grenze, gleitet er entlang der Grenze (jede Achse wird einzeln begrenzt).
 * - Gegner haben keinen Einfluss auf die Bewegung (D-035).
 */
export function movePlayer(world: World, input: PlayerInput, dtMs: number): void {
  const length = Math.hypot(input.x, input.y);
  if (length === 0) return;

  const distance = (TESTWERTE.playerSpeed * dtMs) / 1000;
  const r = LAYOUT.playerRadius;
  const p = world.player;

  p.x += (input.x / length) * distance;
  p.y += (input.y / length) * distance;

  // Spielfeldgrenzen. Der gesamte Zugbereich ab trainTopY ist für den Spieler gesperrt (TECH-08).
  p.x = Math.min(Math.max(p.x, r), LAYOUT.field.width - r);
  p.y = Math.min(Math.max(p.y, r), LAYOUT.trainTopY - r);
}
