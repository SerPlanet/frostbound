// Greybox-Darstellung der Spielwelt (docs/technical/architecture.md, Abschnitt 5).
// Nur Darstellung: liest World und zeichnet. Keine Spielregeln, keine Zustandsänderung.
// Ausschließlich Phaser Graphics und Text, keine Bilddateien (REQ-ARC-003, REQ-TST-002).

import Phaser from "phaser";
import { LAYOUT } from "../config.ts";
import type { Rect, TrainPart, World } from "../game/types.ts";

export interface DrawOptions {
  /** Nur für den Visuals-Test: alle Reparaturzonen zeigen, auch wenn nichts repariert werden muss. */
  forceZones?: boolean;
}

const COLOR = {
  playArea: 0x0f2236,
  trainStrip: 0x08121f,
  rail: 0x3a4a5c,
  intact: 0x4f9d6b,
  damaged: 0xd9a441,
  destroyed: 0x4a2a2a,
  destroyedMark: 0xff5a5a,
  outline: 0x0b1a2a,
  zone: 0x44d0ff,
  player: 0xffffff,
  enemy: 0xd24b4b,
  barBack: 0x1b2b3d,
  shotPlayer: 0xfff27a,
  shotTurret: 0xffa64d,
  turretBarrel: 0xcfd8e3,
};

/** Anzeigeregel: Eine Reparaturzone wird gezeigt, wenn das Objekt repariert werden kann (REQ-REP-002). */
function isRepairable(part: TrainPart): boolean {
  return part.destroyed || part.hp < part.maxHp;
}

function partColor(part: TrainPart): number {
  if (part.destroyed) return COLOR.destroyed;
  if (part.hp < part.maxHp) return COLOR.damaged;
  return COLOR.intact;
}

function barColor(ratio: number): number {
  if (ratio > 0.6) return COLOR.intact;
  if (ratio > 0.3) return COLOR.damaged;
  return COLOR.destroyedMark;
}

export class WorldView {
  private readonly g: Phaser.GameObjects.Graphics;
  private readonly partLabels: Record<"locomotive" | "wagon", Phaser.GameObjects.Text>;
  private readonly zoneLabels: Record<"locomotive" | "wagon", Phaser.GameObjects.Text>;

  constructor(scene: Phaser.Scene) {
    this.g = scene.add.graphics();
    const label = (text: string, size: string, color: string): Phaser.GameObjects.Text =>
      scene.add.text(0, 0, text, { fontFamily: "Arial, sans-serif", fontSize: size, color }).setOrigin(0.5);
    this.partLabels = {
      locomotive: label("LOKOMOTIVE", "20px", "#ffffff"),
      wagon: label("WAGON", "20px", "#ffffff"),
    };
    this.zoneLabels = {
      locomotive: label("REPARATURZONE", "16px", "#b8ecff"),
      wagon: label("REPARATURZONE", "16px", "#b8ecff"),
    };
  }

  draw(world: World, options: DrawOptions = {}): void {
    const g = this.g;
    g.clear();

    // Spielbereich oberhalb des Zuges, Zugbereich unten (D-034).
    g.fillStyle(COLOR.playArea, 1);
    g.fillRect(0, 0, LAYOUT.field.width, LAYOUT.trainTopY);
    g.fillStyle(COLOR.trainStrip, 1);
    g.fillRect(0, LAYOUT.trainTopY, LAYOUT.field.width, LAYOUT.field.height - LAYOUT.trainTopY);
    g.lineStyle(3, COLOR.rail, 1);
    g.lineBetween(0, LAYOUT.trainTopY + 82, LAYOUT.field.width, LAYOUT.trainTopY + 82);

    // Reparaturzonen vor den Zugteilen, damit sie nichts überdecken.
    for (const part of [world.locomotive, world.wagon]) {
      const visible = options.forceZones === true || isRepairable(part);
      this.zoneLabels[part.id].setVisible(visible);
      if (visible) this.drawZone(part.zone, part.id);
    }

    this.drawPart(world.locomotive);
    this.drawPart(world.wagon);
    this.drawTurret(world);

    for (const e of world.enemies) {
      g.fillStyle(COLOR.enemy, 1);
      g.fillRect(e.x - 10, e.y - 10, 20, 20);
      g.lineStyle(2, COLOR.outline, 1);
      g.strokeRect(e.x - 10, e.y - 10, 20, 20);
    }

    g.fillStyle(COLOR.player, 1);
    g.fillCircle(world.player.x, world.player.y, LAYOUT.playerRadius);
    g.lineStyle(3, COLOR.outline, 1);
    g.strokeCircle(world.player.x, world.player.y, LAYOUT.playerRadius);

    // Trefferlinien (Platzhalter für spätere shot-Ereignisse).
    for (const ev of world.events) {
      if (ev.type !== "shot") continue;
      g.lineStyle(3, ev.source === "player" ? COLOR.shotPlayer : COLOR.shotTurret, 1);
      g.lineBetween(ev.fromX, ev.fromY, ev.toX, ev.toY);
    }
  }

  private drawZone(zone: Rect, id: "locomotive" | "wagon"): void {
    const g = this.g;
    g.fillStyle(COLOR.zone, 0.22);
    g.fillRect(zone.x, zone.y, zone.w, zone.h);
    g.lineStyle(3, COLOR.zone, 0.95);
    g.strokeRect(zone.x, zone.y, zone.w, zone.h);
    this.zoneLabels[id].setPosition(zone.x + zone.w / 2, zone.y + zone.h / 2);
  }

  private drawPart(part: TrainPart): void {
    const g = this.g;
    const r = part.rect;
    g.fillStyle(partColor(part), 1);
    g.fillRect(r.x, r.y, r.w, r.h);
    if (part.id === "locomotive") {
      // Lokomotive: dunklerer Frontblock, damit sie vom Wagon unterscheidbar ist.
      g.fillStyle(0x000000, 0.28);
      g.fillRect(r.x, r.y, 80, r.h);
    }
    g.lineStyle(3, COLOR.outline, 1);
    g.strokeRect(r.x, r.y, r.w, r.h);

    // Lebenspunkteleiste im Zugteil.
    const ratio = part.maxHp > 0 ? part.hp / part.maxHp : 0;
    g.fillStyle(COLOR.barBack, 1);
    g.fillRect(r.x + 12, r.y + r.h - 16, r.w - 24, 8);
    g.fillStyle(barColor(ratio), 1);
    g.fillRect(r.x + 12, r.y + r.h - 16, (r.w - 24) * ratio, 8);

    if (part.destroyed) this.drawCross(r.x + 20, r.y + 8, r.w - 40, r.h - 34);
    // Beschriftung seitlich versetzt, damit sie das Geschütz in der Wagon-Mitte nicht überdeckt.
    const labelX = part.id === "locomotive" ? r.x + 80 + (r.w - 80) / 2 : r.x + 70;
    this.partLabels[part.id].setPosition(labelX, r.y + 26);
  }

  private drawTurret(world: World): void {
    const g = this.g;
    const t = world.turret;
    const color = t.destroyed ? COLOR.destroyed : COLOR.turretBarrel;
    g.lineStyle(8, color, 1);
    g.lineBetween(t.x, t.y, t.x, t.y - 34);
    g.fillStyle(t.destroyed ? COLOR.destroyed : COLOR.intact, 1);
    g.fillCircle(t.x, t.y, 16);
    g.lineStyle(3, COLOR.outline, 1);
    g.strokeCircle(t.x, t.y, 16);
    if (t.destroyed) this.drawCross(t.x - 14, t.y - 14, 28, 28);

    const ratio = t.maxHp > 0 ? t.hp / t.maxHp : 0;
    g.fillStyle(COLOR.barBack, 1);
    g.fillRect(t.x - 22, t.y + 22, 44, 6);
    g.fillStyle(barColor(ratio), 1);
    g.fillRect(t.x - 22, t.y + 22, 44 * ratio, 6);
  }

  private drawCross(x: number, y: number, w: number, h: number): void {
    this.g.lineStyle(5, COLOR.destroyedMark, 1);
    this.g.lineBetween(x, y, x + w, y + h);
    this.g.lineBetween(x + w, y, x, y + h);
  }
}
