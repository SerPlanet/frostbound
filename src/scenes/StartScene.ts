// Startbildschirm: Titel und Schwierigkeitsauswahl (REQ-FLOW-002, TECH-12).
// Szenensteuerung ohne Spielregeln: Auswahl per Mausklick oder Taste 1, 2, 3.

import Phaser from "phaser";
import type { Difficulty } from "../game/types.ts";
import { DIFFICULTY_LABELS } from "../view/Hud.ts";

const OPTIONS: { difficulty: Difficulty; key: string }[] = [
  { difficulty: "gemuetlich", key: "ONE" },
  { difficulty: "normal", key: "TWO" },
  { difficulty: "winterhart", key: "THREE" },
];

export class StartScene extends Phaser.Scene {
  private started = false;

  constructor() {
    super("Start");
  }

  create(): void {
    this.started = false;
    this.add.rectangle(640, 360, 1280, 720, 0x0b1a2a);
    this.add.text(640, 150, "FROSTBOUND", { fontFamily: "Arial, sans-serif", fontSize: "88px", color: "#e6f3ff" }).setOrigin(0.5);
    this.add.text(640, 235, "Schwierigkeit wählen", { fontFamily: "Arial, sans-serif", fontSize: "28px", color: "#8aa4bf" }).setOrigin(0.5);

    OPTIONS.forEach((option, i) => {
      const y = 340 + i * 100;
      const box = this.add.rectangle(640, y, 420, 74, 0x16324d).setStrokeStyle(3, 0x44d0ff);
      this.add
        .text(640, y, `${i + 1}   ${DIFFICULTY_LABELS[option.difficulty]}`, { fontFamily: "Arial, sans-serif", fontSize: "34px", color: "#ffffff" })
        .setOrigin(0.5);
      box.setInteractive({ useHandCursor: true });
      box.on("pointerover", () => box.setFillStyle(0x24547f));
      box.on("pointerout", () => box.setFillStyle(0x16324d));
      box.on("pointerdown", () => this.begin(option.difficulty));
      this.input.keyboard?.on(`keydown-${option.key}`, () => this.begin(option.difficulty));
    });

    this.add.text(640, 660, "Mausklick oder Taste 1, 2, 3", { fontFamily: "Arial, sans-serif", fontSize: "20px", color: "#6f879f" }).setOrigin(0.5);
  }

  private begin(difficulty: Difficulty): void {
    if (this.started) return;
    this.started = true;
    this.scene.start("Game", { difficulty });
  }
}
