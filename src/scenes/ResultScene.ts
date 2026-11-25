// Ergebnisbildschirm (REQ-FLOW-003, REQ-STA-001): zeigt Sieg oder Niederlage und die
// tatsächlich erfassten Rundenwerte. Von hier geht es zurück zum Startbildschirm, dort wird
// eine neue Runde gestartet (D-047). Keine Spielregeln: Die Szene formatiert nur die Zusammenfassung.

import Phaser from "phaser";
import type { RoundSummary } from "../game/stats.ts";
import { DIFFICULTY_LABELS } from "../view/Hud.ts";

const FONT = "Arial, sans-serif";

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")} min`;
}

function seconds(ms: number): string {
  return `${Math.round(ms / 1000)} s`;
}

/** Zeilen der Statistik: Bezeichnung und Wert (die sieben Werte aus D-048, Gespawnte mit Gesamtzahl). */
function statLines(s: RoundSummary): [string, string][] {
  return [
    ["Gegner gespawnt", `${s.spawned} von ${s.plannedEnemies}`],
    ["Durch den Spieler besiegt", String(s.defeatedByPlayer)],
    ["Durch das Zuggeschütz besiegt", String(s.defeatedByTurret)],
    ["Gegner haben den Zug erreicht", String(s.reachedTrain)],
    ["Verursachter Schaden", `Lokomotive ${s.damageLocomotive} HP  ·  Wagon ${s.damageWagon} HP`],
    ["Reparaturzeit", `Lokomotive ${seconds(s.repairMsLocomotive)}  ·  Wagon ${seconds(s.repairMsWagon)}`],
    ["Rundenergebnis", s.result === "won" ? "Sieg" : "Niederlage"],
  ];
}

export class ResultScene extends Phaser.Scene {
  private summary: RoundSummary | null = null;
  private leaving = false;

  constructor() {
    super("Result");
  }

  init(data: { summary?: RoundSummary }): void {
    this.summary = data.summary ?? null;
    this.leaving = false;
  }

  create(): void {
    this.add.rectangle(640, 360, 1280, 720, 0x0b1a2a);
    const s = this.summary;
    if (s === null) {
      this.add.text(640, 340, "Kein Rundenergebnis vorhanden", { fontFamily: FONT, fontSize: "32px", color: "#8aa4bf" }).setOrigin(0.5);
    } else {
      const won = s.result === "won";
      this.add.text(640, 100, won ? "SIEG" : "NIEDERLAGE", { fontFamily: FONT, fontSize: "84px", color: won ? "#7ee08f" : "#ff7a7a" }).setOrigin(0.5);
      this.add
        .text(640, 180, `Schwierigkeit: ${DIFFICULTY_LABELS[s.difficulty]}   ·   Spieldauer: ${formatDuration(s.durationMs)}`, { fontFamily: FONT, fontSize: "24px", color: "#9db4cc" })
        .setOrigin(0.5);
      this.add.text(640, 245, "Rundenstatistik", { fontFamily: FONT, fontSize: "26px", color: "#e6f3ff" }).setOrigin(0.5);
      statLines(s).forEach(([label, value], i) => {
        const y = 295 + i * 43;
        this.add.text(300, y, label, { fontFamily: FONT, fontSize: "22px", color: "#c5d6e6" }).setOrigin(0, 0.5);
        this.add.text(980, y, value, { fontFamily: FONT, fontSize: "22px", color: "#ffffff" }).setOrigin(1, 0.5);
      });
    }

    const button = this.add.rectangle(640, 660, 460, 56, 0x16324d).setStrokeStyle(3, 0x44d0ff).setInteractive({ useHandCursor: true });
    this.add.text(640, 660, "Zurück zum Start (Enter)", { fontFamily: FONT, fontSize: "26px", color: "#ffffff" }).setOrigin(0.5);
    button.on("pointerover", () => button.setFillStyle(0x24547f));
    button.on("pointerout", () => button.setFillStyle(0x16324d));
    button.on("pointerdown", () => this.backToStart());
    this.input.keyboard?.on("keydown-ENTER", () => this.backToStart());
  }

  private backToStart(): void {
    if (this.leaving) return;
    this.leaving = true;
    this.scene.start("Start");
  }
}
