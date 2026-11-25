// Spielszene: erzeugt die Welt und stellt sie dar.
// In diesem Schritt noch ohne Simulation: kein stepWorld, keine Eingabeauswertung, keine Regeln.

import Phaser from "phaser";
import { createWorld } from "../game/world.ts";
import type { Difficulty, World } from "../game/types.ts";
import { Hud } from "../view/Hud.ts";
import { WorldView } from "../view/WorldView.ts";

export class GameScene extends Phaser.Scene {
  private difficulty: Difficulty = "normal";
  private world!: World;

  constructor() {
    super("Game");
  }

  init(data: { difficulty?: Difficulty }): void {
    this.difficulty = data.difficulty ?? "normal";
  }

  create(): void {
    this.world = createWorld(this.difficulty);

    const view = new WorldView(this);
    const hud = new Hud(this);
    view.draw(this.world);
    hud.update(this.world);

    // Platzhalter bis Schritt 9: Zugang zum Ergebnisbildschirm und zurück zum Start.
    this.add
      .text(1268, 48, "Platzhalter: Esc Start, F1 Sieg-, F2 Niederlage-Ansicht", { fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#6f879f" })
      .setOrigin(1, 0);
    this.input.keyboard?.on("keydown-ESC", () => this.scene.start("Start"));
    this.input.keyboard?.on("keydown-F1", () => this.scene.start("Result", { result: "won", difficulty: this.difficulty }));
    this.input.keyboard?.on("keydown-F2", () => this.scene.start("Result", { result: "lost", difficulty: this.difficulty }));
  }
}
