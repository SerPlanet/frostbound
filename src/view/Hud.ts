// HUD-Rahmen (REQ-HUD-001, TECH-11): schmale Leiste oben, fünf Anzeigebereiche.
// Nur Darstellung: liest World, verändert nichts. Die Werte werden in diesem Schritt
// einmalig gesetzt, eine laufende Aktualisierung folgt mit der Simulation.

import Phaser from "phaser";
import { LAYOUT } from "../config.ts";
import type { Difficulty, World } from "../game/types.ts";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  gemuetlich: "Gemütlich",
  normal: "Normal",
  winterhart: "Winterhart",
};

const BAR_HEIGHT = 36;
const AREAS = ["LOKOMOTIVE", "WAGON", "GESCHÜTZ", "GEGNER", "GRAD"] as const;

export class Hud {
  private readonly values: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.55);
    g.fillRect(0, 0, LAYOUT.field.width, BAR_HEIGHT);
    g.lineStyle(2, 0x3a4a5c, 1);
    g.lineBetween(0, BAR_HEIGHT, LAYOUT.field.width, BAR_HEIGHT);

    const areaWidth = LAYOUT.field.width / AREAS.length;
    AREAS.forEach((name, i) => {
      const x = i * areaWidth;
      if (i > 0) g.lineBetween(x, 4, x, BAR_HEIGHT - 4);
      scene.add.text(x + 12, BAR_HEIGHT / 2, name, { fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#8aa4bf" }).setOrigin(0, 0.5);
      this.values.push(
        scene.add
          .text(x + areaWidth - 12, BAR_HEIGHT / 2, "–", { fontFamily: "Arial, sans-serif", fontSize: "20px", color: "#ffffff" })
          .setOrigin(1, 0.5),
      );
    });
  }

  /** Setzt die Anzeigewerte aus dem Weltzustand (nur Lesezugriff). */
  update(world: World): void {
    const partText = (p: { hp: number; maxHp: number; destroyed: boolean }): string =>
      p.destroyed ? "ZERSTÖRT" : `${p.hp}/${p.maxHp}`;
    const total = world.spawnPlan.reduce((sum, entry) => sum + entry.count, 0);
    const handled = world.stats.killsByPlayer + world.stats.killsByTurret + world.stats.reachedTrain;

    this.values[0].setText(partText(world.locomotive));
    this.values[1].setText(partText(world.wagon));
    this.values[2].setText(world.turret.destroyed ? "ZERSTÖRT" : "bereit");
    this.values[3].setText(String(total - handled));
    this.values[4].setText(DIFFICULTY_LABELS[world.difficulty]);
  }
}
