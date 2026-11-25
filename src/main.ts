import Phaser from "phaser";

// Minimaler Einstiegspunkt: initialisiert ein Phaser-Spiel im festen Seitenverhältnis 16:9.
// Die logische Spielfeldgröße (1280 x 720) entspricht TECH-01 in docs/technical/architecture.md.
// Szenen, Spiellogik und Konfiguration folgen in den nächsten Implementierungsschritten.

class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create(): void {
    this.add
      .text(640, 360, "FROSTBOUND", { fontSize: "64px", color: "#e6f3ff" })
      .setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#0b1a2a",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene],
});
