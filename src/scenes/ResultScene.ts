// Ergebnisbildschirm als Platzhalter (REQ-FLOW-003).
// Sieg- und Niederlagenlogik sowie echte Statistik folgen in Schritt 9.

import Phaser from "phaser";
import type { Difficulty } from "../game/types.ts";
import { DIFFICULTY_LABELS } from "../view/Hud.ts";

const STAT_LABELS = [
  "Gespawnte Gegner",
  "Durch den Spieler besiegt",
  "Durch das Zuggeschütz besiegt",
  "Gegner, die den Zug erreicht haben",
  "Verursachter Schaden je Zugteil",
  "Reparaturzeiten",
  "Rundenergebnis",
];

export class ResultScene extends Phaser.Scene {
  private result: "won" | "lost" = "won";
  private difficulty: Difficulty = "normal";

  constructor() {
    super("Result");
  }

  init(data: { result?: "won" | "lost"; difficulty?: Difficulty }): void {
    this.result = data.result ?? "won";
    this.difficulty = data.difficulty ?? "normal";
  }

  create(): void {
    const won = this.result === "won";
    this.add.rectangle(640, 360, 1280, 720, 0x0b1a2a);
    this.add
      .text(640, 110, won ? "SIEG" : "NIEDERLAGE", { fontFamily: "Arial, sans-serif", fontSize: "80px", color: won ? "#7ee08f" : "#ff7a7a" })
      .setOrigin(0.5);
    this.add
      .text(640, 185, `Schwierigkeit: ${DIFFICULTY_LABELS[this.difficulty]}`, { fontFamily: "Arial, sans-serif", fontSize: "24px", color: "#8aa4bf" })
      .setOrigin(0.5);

    this.add.text(640, 245, "Statistik (Platzhalter)", { fontFamily: "Arial, sans-serif", fontSize: "26px", color: "#e6f3ff" }).setOrigin(0.5);
    STAT_LABELS.forEach((label, i) => {
      const y = 295 + i * 40;
      this.add.text(380, y, label, { fontFamily: "Arial, sans-serif", fontSize: "22px", color: "#c5d6e6" }).setOrigin(0, 0.5);
      this.add.text(900, y, "–", { fontFamily: "Arial, sans-serif", fontSize: "22px", color: "#ffffff" }).setOrigin(1, 0.5);
    });

    const button = this.add.rectangle(640, 640, 420, 60, 0x16324d).setStrokeStyle(3, 0x44d0ff).setInteractive({ useHandCursor: true });
    this.add.text(640, 640, "Zurück zum Start (Enter)", { fontFamily: "Arial, sans-serif", fontSize: "26px", color: "#ffffff" }).setOrigin(0.5);
    button.on("pointerdown", () => this.scene.start("Start"));
    this.input.keyboard?.on("keydown-ENTER", () => this.scene.start("Start"));
  }
}
