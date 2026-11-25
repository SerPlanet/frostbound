// Spielszene: erzeugt die Welt, treibt die Simulation mit festem Zeitschritt voran (TECH-14)
// und stellt den Zustand dar. Keine Spielregeln: Die Szene gibt nur Eingabe und Zeit weiter.

import Phaser from "phaser";
import { LAYOUT } from "../config.ts";
import { getRoundSummary } from "../game/stats.ts";
import { createWorld, stepWorld } from "../game/world.ts";
import type { Difficulty, PlayerInput, World } from "../game/types.ts";
import { createKeyboardInput } from "../input/keyboard.ts";
import { Hud } from "../view/Hud.ts";
import { WorldView } from "../view/WorldView.ts";

export class GameScene extends Phaser.Scene {
  private difficulty: Difficulty = "normal";
  private world!: World;
  private view!: WorldView;
  private hud!: Hud;
  private readInput!: () => PlayerInput;
  private accumulatorMs = 0;
  private endShown = false;

  constructor() {
    super("Game");
  }

  init(data: { difficulty?: Difficulty }): void {
    this.difficulty = data.difficulty ?? "normal";
  }

  create(): void {
    this.world = createWorld(this.difficulty);

    this.accumulatorMs = 0;
    this.readInput = createKeyboardInput(this);

    this.view = new WorldView(this);
    this.hud = new Hud(this);
    this.view.draw(this.world);
    this.hud.update(this.world);

    this.endShown = false;
  }

  /** Spielende: Die Welt ist eingefroren. Ein Banner nennt das Ergebnis, danach folgt der Ergebnisbildschirm (genau einmal). */
  private showEnd(): void {
    this.endShown = true;
    const won = this.world.status === "won";
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.45).setDepth(10);
    this.add
      .text(640, 340, won ? "SIEG" : "NIEDERLAGE", { fontFamily: "Arial, sans-serif", fontSize: "110px", color: won ? "#7ee08f" : "#ff7a7a" })
      .setOrigin(0.5)
      .setDepth(11);
    const summary = getRoundSummary(this.world);
    this.time.delayedCall(LAYOUT.resultDelayMs, () => this.scene.start("Result", { summary }));
  }

  update(_time: number, deltaMs: number): void {
    // Feste Simulationsschritte, unabhängig von der Bildwiederholrate.
    this.accumulatorMs += Math.min(deltaMs, LAYOUT.maxFrameMs);
    const input = this.readInput();
    while (this.accumulatorMs >= LAYOUT.stepMs) {
      stepWorld(this.world, input, LAYOUT.stepMs);
      this.view.addShots(this.world.events); // Ereignisse des Schrittes für die Trefferlinien merken
      this.accumulatorMs -= LAYOUT.stepMs;
    }
    this.view.draw(this.world, {}, Math.min(deltaMs, LAYOUT.maxFrameMs));
    this.hud.update(this.world);
    if (this.world.status !== "running" && !this.endShown) this.showEnd();
  }
}
