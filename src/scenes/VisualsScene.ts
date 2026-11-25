// Visuals-Test (REQ-TST-001, TECH-13): statische Darstellung vorgegebener Zustände.
// Es läuft keine Simulation und stepWorld wird nicht aufgerufen. Die Zustände sind
// von Hand gesetzte Beispieldaten, keine Ergebnisse von Spielregeln.
// Nur in diesem Testmodus: Die Tasten Q, E, T lösen Schaden über die Schadenslogik aus
// (game/train.ts), R setzt den aktuellen Zustand zurück. Im normalen Spiel gibt es das nicht.

import Phaser from "phaser";
import { CONFIRMED } from "../config.ts";
import { getRoundSummary } from "../game/stats.ts";
import { damageTrainPart, damageTurret } from "../game/train.ts";
import { createWorld } from "../game/world.ts";
import type { TrainPart, World } from "../game/types.ts";
import { Hud } from "../view/Hud.ts";
import { WorldView } from "../view/WorldView.ts";
import type { DrawOptions } from "../view/WorldView.ts";

interface VisualState {
  title: string;
  build: () => { world: World; options?: DrawOptions };
}

function setPart(part: TrainPart, hp: number, destroyed: boolean): void {
  part.hp = hp;
  part.destroyed = destroyed;
}

const STATES: VisualState[] = [
  {
    title: "1  Alle Zugteile intakt (keine Reparaturzonen)",
    build: () => ({ world: createWorld("normal") }),
  },
  {
    title: "2  Zugteil beschädigt (Wagon 55/100, seine Reparaturzone ist sichtbar)",
    build: () => {
      const world = createWorld("normal");
      setPart(world.wagon, 55, false);
      return { world };
    },
  },
  {
    title: "3  Zugteil zerstört (Lokomotive), Wagon beschädigt: beide Zonen gleichzeitig",
    build: () => {
      const world = createWorld("normal");
      setPart(world.locomotive, 0, true);
      setPart(world.wagon, 70, false);
      return { world };
    },
  },
  {
    title: "4  Wagon zerstört: das Geschütz ist ebenfalls zerstört",
    build: () => {
      const world = createWorld("normal");
      setPart(world.wagon, 0, true);
      world.turret.hp = 0;
      world.turret.destroyed = true;
      return { world };
    },
  },
  {
    title: "5  Zerstörter Wagon in Reparatur (HP 50, bleibt zerstört bis zum Abschluss)",
    build: () => {
      const world = createWorld("normal");
      setPart(world.wagon, 50, true);
      world.turret.hp = 0;
      world.turret.destroyed = true;
      return { world };
    },
  },
  {
    title: "6  Alle Reparaturzonen sichtbar (erzwungen, nur Testansicht)",
    build: () => ({ world: createWorld("normal"), options: { forceZones: true } }),
  },
  {
    title: "7  Gegner an festen Beispielpositionen, Spieler und Trefferlinien",
    build: () => {
      const world = createWorld("normal");
      world.enemies = [
        { id: 1, x: 200, y: 120, hp: 3, target: "locomotive" },
        { id: 2, x: 520, y: 260, hp: 3, target: "wagon" },
        { id: 3, x: 900, y: 180, hp: 3, target: "wagon" },
        { id: 4, x: 1100, y: 400, hp: 3, target: "locomotive" },
      ];
      world.player.x = 640;
      world.player.y = 400;
      world.events = [
        { type: "shot", source: "turret", fromX: world.turret.x, fromY: world.turret.y - 34, toX: 900, toY: 180 },
        { type: "shot", source: "player", fromX: 640, fromY: 400, toX: 520, toY: 260 },
      ];
      return { world };
    },
  },
  {
    title: "8  Reparatur aktiv: Wagon (55 HP) wird repariert, Zone hervorgehoben, Fortschritt 50 %. Lokomotive beschädigt, Zone sichtbar",
    build: () => {
      const world = createWorld("normal");
      setPart(world.wagon, 55, false);
      setPart(world.locomotive, 70, false);
      world.wagon.repairProgressMs = 2500;
      world.activeRepair = "wagon";
      world.player.x = world.wagon.zone.x + world.wagon.zone.w / 2;
      world.player.y = world.wagon.zone.y + 40;
      return { world };
    },
  },
];

const NUMBER_KEYS = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT"];

export class VisualsScene extends Phaser.Scene {
  private view!: WorldView;
  private hud!: Hud;
  private titleText!: Phaser.GameObjects.Text;
  private index = 0;
  private world!: World;
  private options: DrawOptions | undefined;

  constructor() {
    super("Visuals");
  }

  create(): void {
    this.view = new WorldView(this);
    this.hud = new Hud(this);
    this.titleText = this.add.text(16, 48, "", { fontFamily: "Arial, sans-serif", fontSize: "20px", color: "#ffffff", backgroundColor: "#00000088" });
    this.add.text(16, 78, "Visuals-Test: Tasten 1 bis 8 oder Pfeiltasten links/rechts. Keine Simulation.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#8aa4bf",
    });
    this.add.text(16, 98, "Schaden (10): Q Lokomotive, E Wagon, T Geschütz. R: aktuellen Zustand zurücksetzen.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#8aa4bf",
    });

    this.add.text(16, 118, "Ergebnisbildschirm-Vorschau mit Beispielwerten: N Niederlage, S Sieg (nur Testmodus).", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#8aa4bf",
    });
    this.input.keyboard?.on("keydown-N", () => this.previewResult("lost"));
    this.input.keyboard?.on("keydown-S", () => this.previewResult("won"));

    NUMBER_KEYS.forEach((key, i) => this.input.keyboard?.on(`keydown-${key}`, () => this.show(i)));
    this.input.keyboard?.on("keydown-Q", () => this.applyDamage(() => damageTrainPart(this.world, "locomotive", CONFIRMED.enemyDamage)));
    this.input.keyboard?.on("keydown-E", () => this.applyDamage(() => damageTrainPart(this.world, "wagon", CONFIRMED.enemyDamage)));
    this.input.keyboard?.on("keydown-T", () => this.applyDamage(() => damageTurret(this.world, CONFIRMED.enemyDamage)));
    this.input.keyboard?.on("keydown-R", () => this.show(this.index));
    this.input.keyboard?.on("keydown-LEFT", () => this.show((this.index + STATES.length - 1) % STATES.length));
    this.input.keyboard?.on("keydown-RIGHT", () => this.show((this.index + 1) % STATES.length));
    this.show(0);
  }

  private show(index: number): void {
    this.index = index;
    const { world, options } = STATES[index].build();
    this.world = world;
    this.options = options;
    this.view.clearShots();
    this.view.addShots(world.events, Infinity); // statische Testansicht: Trefferlinien bleiben stehen
    this.titleText.setText(STATES[index].title);
    this.redraw();
  }

  /** Zeigt den Ergebnisbildschirm mit fest vorgegebenen Beispielwerten (keine Simulation, keine Spielregeln). */
  private previewResult(result: "won" | "lost"): void {
    const world = createWorld("normal");
    world.status = result;
    world.stats.result = result;
    if (result === "won") {
      world.timeMs = 128000;
      Object.assign(world.stats, { spawned: 40, killsByPlayer: 20, killsByTurret: 16, reachedTrain: 4 });
      world.stats.damageByPart = { locomotive: 10, wagon: 30 };
      world.stats.repairMsByPart = { locomotive: 10000, wagon: 5000 };
    } else {
      world.timeMs = 87000;
      Object.assign(world.stats, { spawned: 31, killsByPlayer: 14, killsByTurret: 9, reachedTrain: 8 });
      world.stats.damageByPart = { locomotive: 50, wagon: 30 };
      world.stats.repairMsByPart = { locomotive: 25000, wagon: 5000 };
    }
    this.scene.start("Result", { summary: getRoundSummary(world) });
  }

  private applyDamage(damage: () => number): void {
    damage();
    this.titleText.setText(`${STATES[this.index].title}   [Schaden angewendet, R setzt zurück]`);
    this.redraw();
  }

  private redraw(): void {
    this.view.draw(this.world, this.options);
    this.hud.update(this.world);
  }
}
