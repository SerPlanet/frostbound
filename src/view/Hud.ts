// HUD (REQ-HUD-001, TECH-11): schmale, halbtransparente Leiste oben mit fünf Anzeigebereichen.
// Nur Darstellung: liest World, verändert nichts. Die Leiste ist niedrig und durchscheinend,
// damit Gegner und Spieler am oberen Rand darunter sichtbar bleiben.

import Phaser from "phaser";
import { LAYOUT } from "../config.ts";
import type { Difficulty, World } from "../game/types.ts";
import { getPartCondition } from "../game/train.ts";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  gemuetlich: "Gemütlich",
  normal: "Normal",
  winterhart: "Winterhart",
};

const BAR_HEIGHT = 32;
const BAR_ALPHA = 0.4;
const AREAS = ["LOKOMOTIVE", "WAGON", "GESCHÜTZ", "GEGNER übrig / aktiv", "GRAD"] as const;
const FONT = "Arial, sans-serif";

const COLOR_NORMAL = "#ffffff";
const COLOR_DAMAGED = "#ffd76a";
const COLOR_DESTROYED = "#ff7a7a";

export class Hud {
  private readonly values: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.fillStyle(0x000000, BAR_ALPHA);
    g.fillRect(0, 0, LAYOUT.field.width, BAR_HEIGHT);
    g.lineStyle(2, 0x3a4a5c, 0.8);
    g.lineBetween(0, BAR_HEIGHT, LAYOUT.field.width, BAR_HEIGHT);

    const areaWidth = LAYOUT.field.width / AREAS.length;
    AREAS.forEach((name, i) => {
      const x = i * areaWidth;
      if (i > 0) g.lineBetween(x, 4, x, BAR_HEIGHT - 4);
      scene.add.text(x + 12, BAR_HEIGHT / 2, name, { fontFamily: FONT, fontSize: "13px", color: "#9db4cc" }).setOrigin(0, 0.5);
      this.values.push(scene.add.text(x + areaWidth - 12, BAR_HEIGHT / 2, "–", { fontFamily: FONT, fontSize: "19px", color: COLOR_NORMAL }).setOrigin(1, 0.5));
    });
  }

  /** Setzt die Anzeigewerte aus dem Weltzustand (nur Lesezugriff). */
  update(world: World): void {
    // Zerstörte Teile erscheinen rot. Läuft ihre Reparatur, steht daneben der Stand (z. B. 35/100).
    const partText = (p: { hp: number; maxHp: number; destroyed: boolean }): { text: string; color: string } => {
      const condition = getPartCondition(p);
      if (condition === "destroyed") return { text: p.hp > 0 ? `${p.hp}/${p.maxHp}` : "ZERSTÖRT", color: COLOR_DESTROYED };
      return { text: `${p.hp}/${p.maxHp}`, color: condition === "damaged" ? COLOR_DAMAGED : COLOR_NORMAL };
    };
    const show = (index: number, text: string, color: string): void => {
      this.values[index].setText(text).setColor(color);
    };

    for (const [index, part] of [world.locomotive, world.wagon, world.turret].entries()) {
      const v = partText(part);
      show(index, v.text, v.color);
    }
    // Übrig = noch nicht abgearbeitet (ausstehend oder aktiv), danach die aktiven Gegner im Spielfeld.
    const total = world.spawnPlan.reduce((sum, entry) => sum + entry.count, 0);
    const handled = world.stats.killsByPlayer + world.stats.killsByTurret + world.stats.reachedTrain;
    show(3, `${total - handled} / ${world.enemies.length}`, COLOR_NORMAL);
    show(4, DIFFICULTY_LABELS[world.difficulty], COLOR_NORMAL);
  }
}
