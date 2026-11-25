// Greybox-Darstellung der Spielwelt (docs/technical/architecture.md, Abschnitt 5).
// Nur Darstellung: liest World und zeichnet. Keine Spielregeln, keine Zustandsänderung.
// Ausschließlich Phaser Graphics und Text, keine Bilddateien (REQ-ARC-003, REQ-TST-002).

import Phaser from "phaser";
import { CONFIRMED, LAYOUT, TESTWERTE } from "../config.ts";
import { getPartCondition } from "../game/train.ts";
import type { GameEvent, TrainPart, World } from "../game/types.ts";

export interface DrawOptions {
  /** Nur für den Visuals-Test: alle Reparaturzonen zeigen, auch wenn nichts repariert werden muss. */
  forceZones?: boolean;
}

/** Breite des Frontblocks der Lokomotive (nur Darstellung). */
const FRONT_WIDTH = 80;

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
  return getPartCondition(part) !== "intact";
}

/** Farbe aus dem Zustand des Teils (intakt grün, beschädigt gelb, zerstört dunkelrot). */
function partColor(part: TrainPart): number {
  const condition = getPartCondition(part);
  if (condition === "destroyed") return COLOR.destroyed;
  if (condition === "damaged") return COLOR.damaged;
  return COLOR.intact;
}

function barColor(ratio: number): number {
  if (ratio > 0.6) return COLOR.intact;
  if (ratio > 0.3) return COLOR.damaged;
  return COLOR.destroyedMark;
}

export class WorldView {
  private readonly g: Phaser.GameObjects.Graphics;
  private shots: { event: Extract<GameEvent, { type: "shot" }>; remainingMs: number }[] = [];
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

  draw(world: World, options: DrawOptions = {}, deltaMs: number = 0): void {
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
      if (visible) this.drawZone(part, world.activeRepair === part.id);
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

    // Trefferlinien: kurz sichtbar, danach ausgeblendet (reine Anzeige, keine Spielwirkung).
    this.shots = this.shots.filter((shot) => (shot.remainingMs -= deltaMs) > 0);
    for (const { event } of this.shots) {
      g.lineStyle(3, event.source === "player" ? COLOR.shotPlayer : COLOR.shotTurret, 1);
      g.lineBetween(event.fromX, event.fromY, event.toX, event.toY);
    }
  }

  /** Merkt sich Treffer-Ereignisse für die Anzeige (Standard: kurz, Infinity für statische Testansichten). */
  addShots(events: GameEvent[], displayMs: number = LAYOUT.shotDisplayMs): void {
    for (const event of events) {
      if (event.type === "shot") this.shots.push({ event, remainingMs: displayMs });
    }
  }

  clearShots(): void {
    this.shots = [];
  }

  /** Reparaturzone: die gerade repariert werdende Zone ist hervorgehoben, unten zeigt eine Leiste den Fortschritt zum nächsten Reparaturschritt. */
  private drawZone(part: TrainPart, active: boolean): void {
    const g = this.g;
    const zone = part.zone;
    g.fillStyle(COLOR.zone, active ? 0.38 : 0.22);
    g.fillRect(zone.x, zone.y, zone.w, zone.h);
    g.lineStyle(active ? 5 : 3, active ? COLOR.shotPlayer : COLOR.zone, 0.95);
    g.strokeRect(zone.x, zone.y, zone.w, zone.h);

    const progress = Math.min(1, part.repairProgressMs / TESTWERTE.repairStepMs);
    g.fillStyle(COLOR.barBack, 1);
    g.fillRect(zone.x + 12, zone.y + zone.h - 18, zone.w - 24, 8);
    g.fillStyle(COLOR.zone, 1);
    g.fillRect(zone.x + 12, zone.y + zone.h - 18, (zone.w - 24) * progress, 8);
    this.zoneLabels[part.id].setPosition(zone.x + zone.w / 2, zone.y + zone.h / 2 - 10);
  }

  private drawPart(part: TrainPart): void {
    const g = this.g;
    const r = part.rect;
    g.fillStyle(partColor(part), 1);
    g.fillRect(r.x, r.y, r.w, r.h);
    if (part.id === "locomotive") {
      // Lokomotive: dunklerer Frontblock mit Pfeil in Fahrtrichtung (D-061: Front zeigt nach rechts).
      const facingRight = LAYOUT.trainFacing === "right";
      const frontX = facingRight ? r.x + r.w - FRONT_WIDTH : r.x;
      g.fillStyle(0x000000, 0.28);
      g.fillRect(frontX, r.y, FRONT_WIDTH, r.h);
      const tipX = facingRight ? frontX + FRONT_WIDTH - 14 : frontX + 14;
      const baseX = facingRight ? frontX + 18 : frontX + FRONT_WIDTH - 18;
      g.fillStyle(0xffffff, 0.6);
      g.fillTriangle(tipX, r.y + r.h / 2 - 6, baseX, r.y + 16, baseX, r.y + r.h - 28);
    }
    g.lineStyle(3, COLOR.outline, 1);
    g.strokeRect(r.x, r.y, r.w, r.h);

    // Lebenspunkteleiste im Zugteil.
    const ratio = part.maxHp > 0 ? part.hp / part.maxHp : 0;
    g.fillStyle(COLOR.barBack, 1);
    g.fillRect(r.x + 12, r.y + r.h - 16, r.w - 24, 8);
    g.fillStyle(barColor(ratio), 1);
    g.fillRect(r.x + 12, r.y + r.h - 16, (r.w - 24) * ratio, 8);
    g.lineStyle(2, COLOR.outline, 1); // Umrandung, damit eine gelbe Leiste auf gelbem Teil lesbar bleibt
    g.strokeRect(r.x + 12, r.y + r.h - 16, r.w - 24, 8);

    if (part.destroyed) this.drawCross(r.x + 20, r.y + 8, r.w - 40, r.h - 34);
    // Beschriftung seitlich versetzt, damit sie das Geschütz in der Wagon-Mitte nicht überdeckt.
    const bodyStart = LAYOUT.trainFacing === "right" ? r.x : r.x + FRONT_WIDTH;
    const labelX = part.id === "locomotive" ? bodyStart + (r.w - FRONT_WIDTH) / 2 : r.x + 70;
    this.partLabels[part.id].setPosition(labelX, r.y + 26);
  }

  private drawTurret(world: World): void {
    const g = this.g;
    const t = world.turret;
    const condition = getPartCondition(t);
    const color = t.destroyed ? COLOR.destroyed : COLOR.turretBarrel;
    g.lineStyle(8, color, 1);
    g.lineBetween(t.x, t.y, t.x, t.y - 34);
    g.fillStyle(condition === "destroyed" ? COLOR.destroyed : condition === "damaged" ? COLOR.damaged : COLOR.intact, 1);
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
