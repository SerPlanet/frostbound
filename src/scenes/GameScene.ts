// Spielszene: erzeugt die Welt, treibt die Simulation mit festem Zeitschritt voran (TECH-14)
// und stellt den Zustand dar. Keine Spielregeln: Die Szene gibt nur Eingabe und Zeit weiter.

import Phaser from "phaser";
import { LAYOUT } from "../config.ts";
import { createWorld, stepWorld } from "../game/world.ts";
import type { Difficulty, PlayerInput, World } from "../game/types.ts";
import { createKeyboardInput } from "../input/keyboard.ts";
import { Hud } from "../view/Hud.ts";
import { WorldView } from "../view/WorldView.ts";

export class GameScene extends Phaser.Scene {
  private difficulty: Difficulty = "normal";
  private world!: World;
  private view!: WorldView;
  private readInput!: () => PlayerInput;
  private accumulatorMs = 0;

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
    const hud = new Hud(this);
    this.view.draw(this.world);
    hud.update(this.world);

    // Platzhalter bis Schritt 9: Zugang zum Ergebnisbildschirm und zurück zum Start.
    this.add
      .text(1268, 48, "Platzhalter: Esc Start, F1 Sieg-, F2 Niederlage-Ansicht", { fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#6f879f" })
      .setOrigin(1, 0);
    this.input.keyboard?.on("keydown-ESC", () => this.scene.start("Start"));
    this.input.keyboard?.on("keydown-F1", () => this.scene.start("Result", { result: "won", difficulty: this.difficulty }));
    this.input.keyboard?.on("keydown-F2", () => this.scene.start("Result", { result: "lost", difficulty: this.difficulty }));
  }

  update(_time: number, deltaMs: number): void {
    // Feste Simulationsschritte, unabhängig von der Bildwiederholrate.
    this.accumulatorMs += Math.min(deltaMs, LAYOUT.maxFrameMs);
    const input = this.readInput();
    while (this.accumulatorMs >= LAYOUT.stepMs) {
      stepWorld(this.world, input, LAYOUT.stepMs);
      this.accumulatorMs -= LAYOUT.stepMs;
    }
    this.view.draw(this.world);
  }
}
