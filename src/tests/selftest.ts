// Selbsttest ohne Framework (REQ-TST-003, TECH-13).
// Ausführen: node src/tests/selftest.ts   (Node 22, native TypeScript-Unterstützung)
// Importiert nur game/ und config.ts, keine Browser-APIs, kein Phaser.

import { CONFIRMED, LAYOUT, TESTWERTE } from "../config.ts";
import { isTurretFunctional, runCombat } from "../game/combat.ts";
import { chooseTarget } from "../game/enemies.ts";
import { updateRepair } from "../game/repair.ts";
import { spawnEnemies } from "../game/spawning.ts";
import { damageTrainPart, damageTurret, getPartCondition } from "../game/train.ts";
import { createWorld, stepWorld } from "../game/world.ts";
import type { Difficulty, Enemy, PlayerInput, Rect, World } from "../game/types.ts";

// Nur für den Node-Aufruf am Ende der Datei. Kein Paket nötig.
declare const process: { exit(code: number): never } | undefined;

let passed = 0;
let failed = 0;
// Ausgabe der Zeilen: Standard Konsole (Node), im Browser übergibt die Testseite eine eigene Funktion.
let log: (line: string) => void = (line) => console.log(line);

function check(name: string, condition: boolean): void {
  if (condition) {
    passed++;
    log(`PASS  ${name}`);
  } else {
    failed++;
    log(`FAIL  ${name}`);
  }
}

/** Einfache feste Zufallsfunktion nur für Tests (kein Seed-System der Spiellogik). */
function makeTestRandom(): () => number {
  let state = 12345;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

/** Vergleichbarer Schnappschuss einer Welt (Funktionen wie `random` werden ausgelassen). */
function snapshot(world: World): string {
  return JSON.stringify(world);
}

function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function inside(px: number, py: number, r: Rect): boolean {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

export function runSelfTest(output?: (line: string) => void): { passed: number; failed: number } {
  passed = 0;
  failed = 0;
  if (output) log = output;
  const idle: PlayerInput = { x: 0, y: 0 };

  // --- Neue Welt (REQ-TRN-001, REQ-TRN-003)
  const w = createWorld("normal", makeTestRandom());
  check("REQ-TRN-001  Neue Welt wird erstellt", w !== null && typeof w === "object");
  check("REQ-TRN-003  Lokomotive startet mit 100 HP", w.locomotive.hp === 100 && w.locomotive.maxHp === 100);
  check("REQ-TRN-003  Wagon startet mit 100 HP", w.wagon.hp === 100 && w.wagon.maxHp === 100);
  check("REQ-TRN-005  Geschütz startet mit 20 HP", w.turret.hp === 20 && w.turret.maxHp === 20);
  check("REQ-WL-005   Spielstatus startet mit running", w.status === "running");
  check(
    "REQ-TRN-001  Genau eine Lokomotive, ein Wagon, ein Geschütz",
    w.locomotive.id === "locomotive" &&
      w.wagon.id === "wagon" &&
      typeof w.turret.hp === "number" &&
      !Object.keys(w).some((k) => k === "locomotives" || k === "wagons" || k === "turrets"),
  );
  check("REQ-TRN-001  Geschütz sitzt auf dem Wagon", inside(w.turret.x, w.turret.y, w.wagon.rect));
  check("REQ-TRN-001  Lokomotive trägt kein Geschütz", !inside(w.turret.x, w.turret.y, w.locomotive.rect));
  check(
    "REQ-TRN-003  Zugteile starten intakt und ohne Reparaturfortschritt",
    !w.locomotive.destroyed && !w.wagon.destroyed && w.locomotive.repairProgressMs === 0 && w.wagon.repairProgressMs === 0 && !w.turret.destroyed,
  );
  check("REQ-TRN-002  Zug liegt im Zugbereich am unteren Rand", w.locomotive.rect.y >= LAYOUT.trainTopY && w.wagon.rect.y >= LAYOUT.trainTopY);
  check("REQ-REP-004  Reparaturzonen überlappen nicht", !overlaps(w.locomotive.zone, w.wagon.zone));
  check("REQ-PLR-002  Spieler hat keine Lebenspunkte", !("hp" in w.player));
  check("REQ-PLR-001  Spieler startet an der konfigurierten Position", w.player.x === LAYOUT.playerStart.x && w.player.y === LAYOUT.playerStart.y);
  check("REQ-ENM-001  Gegnerliste startet leer", w.enemies.length === 0);
  check(
    "REQ-STA-001  Statistik startet bei null",
    w.stats.spawned === 0 && w.stats.killsByPlayer === 0 && w.stats.killsByTurret === 0 && w.stats.reachedTrain === 0 && w.events.length === 0,
  );

  // --- Wellenplan: Summe je Schwierigkeitsgrad (REQ-CORE-002, REQ-DIF-002)
  const expected: Record<Difficulty, number> = { gemuetlich: 25, normal: 40, winterhart: 60 };
  for (const d of Object.keys(expected) as Difficulty[]) {
    const plan = createWorld(d, makeTestRandom()).spawnPlan;
    const total = plan.reduce((sum, e) => sum + e.count, 0);
    const sorted = plan.every((e, i) => i === 0 || plan[i - 1].atMs <= e.atMs);
    check(`REQ-DIF-002  Wellenplan ${d}: Summe ${expected[d]} und zeitlich sortiert`, total === expected[d] && sorted);
  }
  check("REQ-CORE-002 Wellenplan folgt der Konfiguration", createWorld("normal").spawnPlan.length === TESTWERTE.waves.normal.singles.count + TESTWERTE.waves.normal.groups.count + TESTWERTE.waves.normal.wave.count / TESTWERTE.waves.normal.wave.perSecond);

  // --- stepWorld (REQ-WL-005)
  const running = createWorld("normal", makeTestRandom());
  stepWorld(running, idle, LAYOUT.stepMs);
  check("REQ-ARC-007  stepWorld bringt eine laufende Welt voran", running.timeMs === LAYOUT.stepMs);

  for (const status of ["won", "lost"] as const) {
    const ended = createWorld("normal", makeTestRandom());
    ended.status = status;
    ended.stats.result = status;
    const before = snapshot(ended);
    for (let i = 0; i < 1000; i++) stepWorld(ended, { x: 1, y: -1 }, LAYOUT.stepMs);
    check(`REQ-WL-005   stepWorld verändert eine beendete Welt (${status}) nicht`, snapshot(ended) === before);
  }

  // --- Reproduzierbarkeit (REQ-ARC-007)
  const inputs: PlayerInput[] = [idle, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 1 }];
  function run(): string {
    const world = createWorld("winterhart", makeTestRandom());
    for (let i = 0; i < 600; i++) stepWorld(world, inputs[i % inputs.length], LAYOUT.stepMs);
    return snapshot(world);
  }
  check("REQ-ARC-007  Zwei Läufe mit gleicher Zufallsfunktion und gleichen Eingaben sind identisch", run() === run());

  // --- Spielerbewegung (REQ-PLR-001, REQ-PLR-004, REQ-PLR-005)
  {
    const dt = LAYOUT.stepMs;
    const v = TESTWERTE.playerSpeed;
    const r = LAYOUT.playerRadius;
    const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-6;
    const fresh = (): World => createWorld("normal", makeTestRandom());
    const steps = (world: World, input: PlayerInput, n: number, stepMs: number = dt): void => {
      for (let i = 0; i < n; i++) stepWorld(world, input, stepMs);
    };
    const hitsRect = (cx: number, cy: number, rect: Rect): boolean => {
      const nx = Math.min(Math.max(cx, rect.x), rect.x + rect.w);
      const ny = Math.min(Math.max(cy, rect.y), rect.y + rect.h);
      return Math.hypot(cx - nx, cy - ny) < r;
    };
    const stepLen = (v * dt) / 1000;

    for (const [name, input, ex, ey] of [
      ["nach oben", { x: 0, y: -1 }, 0, -1],
      ["nach unten", { x: 0, y: 1 }, 0, 1],
      ["nach links", { x: -1, y: 0 }, -1, 0],
      ["nach rechts", { x: 1, y: 0 }, 1, 0],
    ] as [string, PlayerInput, number, number][]) {
      const world = fresh();
      const s = { x: world.player.x, y: world.player.y };
      steps(world, input, 1);
      check(`REQ-PLR-001  Bewegung ${name} (feste Geschwindigkeit)`, near(world.player.x, s.x + ex * stepLen) && near(world.player.y, s.y + ey * stepLen));
    }

    {
      const world = fresh();
      const s = { x: world.player.x, y: world.player.y };
      steps(world, { x: 1, y: -1 }, 10);
      const dx = world.player.x - s.x;
      const dy = s.y - world.player.y;
      check("REQ-PLR-001  Diagonale Bewegung geht in beide Richtungen", dx > 0 && dy > 0 && near(dx, dy));
    }

    {
      const diag = fresh();
      const axis = fresh();
      const d0 = { x: diag.player.x, y: diag.player.y };
      const a0 = { x: axis.player.x, y: axis.player.y };
      steps(diag, { x: 1, y: -1 }, 30);
      steps(axis, { x: 1, y: 0 }, 30);
      const diagDist = Math.hypot(diag.player.x - d0.x, diag.player.y - d0.y);
      const axisDist = Math.hypot(axis.player.x - a0.x, axis.player.y - a0.y);
      check("REQ-PLR-001  Diagonale ist nicht schneller als Achsenbewegung", near(diagDist, axisDist) && near(axisDist, 30 * stepLen));
    }

    {
      const a = fresh();
      const b = fresh();
      steps(a, { x: 1, y: 0 }, 60, 1000 / 60);
      steps(b, { x: 1, y: 0 }, 30, 1000 / 30);
      check("REQ-PLR-001  Bewegung hängt nicht von der Schrittgröße (Bildrate) ab", near(a.player.x, b.player.x) && near(a.player.x, LAYOUT.playerStart.x + v));
    }

    {
      const world = fresh();
      const s = { x: world.player.x, y: world.player.y };
      steps(world, { x: 0, y: 0 }, 100);
      check("REQ-PLR-001  Keine Bewegung bei fehlender Eingabe", world.player.x === s.x && world.player.y === s.y);
    }

    {
      const left = fresh();
      const right = fresh();
      const up = fresh();
      const down = fresh();
      steps(left, { x: -1, y: 0 }, 1000);
      steps(right, { x: 1, y: 0 }, 1000);
      steps(up, { x: 0, y: -1 }, 1000);
      steps(down, { x: 0, y: 1 }, 1000);
      check(
        "REQ-PLR-005  Begrenzung am Spielfeldrand (links, rechts, oben)",
        near(left.player.x, r) && near(right.player.x, LAYOUT.field.width - r) && near(up.player.y, r),
      );
      check("REQ-PLR-005  Begrenzung am unteren Rand des Spielbereichs (oberhalb des Zuges)", near(down.player.y, LAYOUT.trainTopY - r));
    }

    {
      const slide = fresh();
      slide.player.x = r;
      slide.player.y = 360;
      steps(slide, { x: -1, y: -1 }, 10);
      check("REQ-PLR-005  Gleiten an der Wand: x bleibt an der Grenze, y nimmt mit dem Diagonalanteil ab", near(slide.player.x, r) && near(slide.player.y, 360 - 10 * stepLen * Math.SQRT1_2));
    }

    {
      let blocked = true;
      let inside = false;
      for (let x = 0; x <= LAYOUT.field.width; x += 20) {
        const world = fresh();
        world.player.x = Math.min(Math.max(x, r), LAYOUT.field.width - r);
        world.player.y = 300;
        for (let i = 0; i < 600; i++) {
          stepWorld(world, { x: 0, y: 1 }, dt);
          if (world.player.y > LAYOUT.trainTopY - r + 1e-9) blocked = false;
          if (hitsRect(world.player.x, world.player.y, world.locomotive.rect) || hitsRect(world.player.x, world.player.y, world.wagon.rect)) inside = true;
        }
      }
      check("REQ-PLR-005  Spieler gelangt nie in den Zugbereich", blocked);
      check("REQ-PLR-005  Spieler überlappt nie Lokomotive oder Wagon", !inside);
    }

    {
      const world = fresh();
      world.player.x = LAYOUT.wagonRect.x + 100;
      world.player.y = LAYOUT.trainTopY - r;
      steps(world, { x: 1, y: 1 }, 50);
      check("REQ-PLR-005  Diagonal gegen den Zug: Spieler bleibt oberhalb und gleitet seitlich", world.player.y <= LAYOUT.trainTopY - r + 1e-9 && world.player.x > LAYOUT.wagonRect.x + 100);
    }

    for (const status of ["won", "lost"] as const) {
      const world = fresh();
      world.status = status;
      const s = { x: world.player.x, y: world.player.y };
      steps(world, { x: 1, y: -1 }, 200);
      check(`REQ-WL-005   Keine Bewegung bei beendetem Spiel (${status})`, world.player.x === s.x && world.player.y === s.y);
    }

    {
      const free = fresh();
      const crowded = fresh();
      for (let i = 0; i < 20; i++) {
        crowded.enemies.push({ id: i + 1, x: crowded.player.x + i * 3, y: crowded.player.y - i * 2, hp: 3, target: "wagon" });
      }
      steps(free, { x: 1, y: -1 }, 40);
      steps(crowded, { x: 1, y: -1 }, 40);
      check("REQ-PLR-004  Gegner behindern den Spieler nicht", near(free.player.x, crowded.player.x) && near(free.player.y, crowded.player.y));
    }

    check("REQ-PLR-002  Spieler hat weiterhin keine Lebenspunkte", !("hp" in fresh().player));
  }

  // --- Zug: Schaden und Zerstörung (REQ-TRN-003, REQ-TRN-004, REQ-TRN-005)
  {
    const fresh = (): World => createWorld("normal", makeTestRandom());
    const dmg = CONFIRMED.enemyDamage;

    {
      const world = fresh();
      const applied = damageTrainPart(world, "locomotive", dmg);
      check("REQ-TRN-004  10 Schaden reduzieren die Lokomotive von 100 auf 90", applied === 10 && world.locomotive.hp === 90 && !world.locomotive.destroyed);
      check("REQ-TRN-004  Der Schaden wird je Zugteil in der Statistik erfasst", world.stats.damageByPart.locomotive === 10 && world.stats.damageByPart.wagon === 0);
    }
    {
      const world = fresh();
      damageTrainPart(world, "wagon", dmg);
      check("REQ-TRN-004  Der Schaden ist für Lokomotive und Wagon identisch", world.wagon.hp === 90);
    }
    {
      const world = fresh();
      for (let i = 0; i < 3; i++) damageTrainPart(world, "wagon", dmg);
      check("REQ-TRN-004  Wiederholter Schaden reduziert die HP korrekt (3 mal 10: 70)", world.wagon.hp === 70 && world.stats.damageByPart.wagon === 30);
    }
    {
      const world = fresh();
      for (let i = 0; i < 9; i++) damageTrainPart(world, "locomotive", dmg);
      check("REQ-TRN-003  Bei 90 Schaden bleibt die Lokomotive bei 10 HP und intakt", world.locomotive.hp === 10 && !world.locomotive.destroyed);
      damageTrainPart(world, "locomotive", dmg);
      check("REQ-TRN-003  Bei 0 HP wird das Zugteil zerstört", world.locomotive.hp === 0 && world.locomotive.destroyed);
      check("REQ-TRN-003  Zerstörung erzeugt genau ein Ereignis partDestroyed", world.events.filter((e) => e.type === "partDestroyed").length === 1);
    }
    {
      const world = fresh();
      world.locomotive.hp = 5;
      const applied = damageTrainPart(world, "locomotive", dmg);
      check("REQ-TRN-003  HP fallen nie unter 0 (Schaden 10 bei 5 HP: 0 HP, angewendet 5)", world.locomotive.hp === 0 && applied === 5 && world.stats.damageByPart.locomotive === 5);
      const big = fresh();
      damageTrainPart(big, "wagon", 100000);
      check("REQ-TRN-003  Sehr großer Schaden: 0 HP, nur 100 angewendet, zerstört", big.wagon.hp === 0 && big.wagon.destroyed && big.stats.damageByPart.wagon === 100);
    }
    {
      const world = fresh();
      damageTrainPart(world, "locomotive", 1000);
      const before = JSON.stringify(world);
      const applied = damageTrainPart(world, "locomotive", dmg);
      check("REQ-TRN-003  Weiterer Schaden an einem zerstörten Teil ändert nichts (HP, Status, Statistik, Ereignisse)", applied === 0 && JSON.stringify(world) === before && world.locomotive.hp === 0 && world.locomotive.destroyed);
    }
    {
      const world = fresh();
      for (const bad of [0, -5, Number.NaN]) damageTrainPart(world, "wagon", bad);
      damageTurret(world, -3);
      check("REQ-TRN-003  Schaden 0, negativ oder ungültig wird ignoriert", world.wagon.hp === 100 && world.turret.hp === 20 && world.stats.damageByPart.wagon === 0);
    }

    // Wagon und Geschütz
    {
      const world = fresh();
      damageTrainPart(world, "wagon", 1000);
      check("REQ-TRN-005  Zerstörung des Wagons zerstört auch das Geschütz", world.wagon.destroyed && world.turret.destroyed && world.turret.hp === 0);
      check("REQ-TRN-005  Zerstörter Wagon: Ereignisse partDestroyed und turretDestroyed", world.events.some((e) => e.type === "partDestroyed" && e.part === "wagon") && world.events.some((e) => e.type === "turretDestroyed"));
      check("REQ-TRN-005  Die Zerstörung des Wagons lässt die Lokomotive unberührt", world.locomotive.hp === 100 && !world.locomotive.destroyed);
    }
    {
      const world = fresh();
      world.turret.hp = 3;
      damageTrainPart(world, "wagon", 1000);
      check("REQ-TRN-005  Der vorherige HP-Zustand des Geschützes ist irrelevant (3 HP: zerstört)", world.turret.destroyed && world.turret.hp === 0);
    }
    {
      const world = fresh();
      damageTurret(world, 20);
      damageTrainPart(world, "wagon", 1000);
      check("REQ-TRN-005  Bereits zerstörtes Geschütz bleibt bei Wagon-Zerstörung gültig und erzeugt kein zweites Ereignis", world.turret.destroyed && world.turret.hp === 0 && world.events.filter((e) => e.type === "turretDestroyed").length === 1);
    }
    {
      const world = fresh();
      damageTrainPart(world, "wagon", 99);
      check("REQ-TRN-005  Beschädigter, nicht zerstörter Wagon (1 HP): das Geschütz bleibt funktionsfähig", world.wagon.hp === 1 && !world.wagon.destroyed && !world.turret.destroyed && world.turret.hp === 20);
    }
    {
      const world = fresh();
      damageTrainPart(world, "locomotive", 60);
      check("REQ-TRN-003  Schaden an der Lokomotive beeinflusst Wagon und Geschütz nicht", world.wagon.hp === 100 && !world.wagon.destroyed && world.turret.hp === 20 && !world.turret.destroyed);
      damageTrainPart(world, "locomotive", 1000);
      check("REQ-TRN-003  Auch eine zerstörte Lokomotive lässt Wagon und Geschütz unberührt", world.locomotive.destroyed && world.wagon.hp === 100 && !world.wagon.destroyed && !world.turret.destroyed && world.turret.hp === 20);
    }
    {
      const world = fresh();
      const applied = damageTurret(world, 5);
      check("REQ-TRN-005  Schaden am Geschütz: 20 auf 15 HP, der Wagon bleibt unberührt", applied === 5 && world.turret.hp === 15 && world.wagon.hp === 100 && !world.wagon.destroyed);
      damageTurret(world, 1000);
      check("REQ-TRN-005  Zerstörtes Geschütz auf intaktem Wagon: Wagon bleibt intakt und funktionsfähig", world.turret.destroyed && world.turret.hp === 0 && !world.wagon.destroyed && world.wagon.hp === 100);
      const before = JSON.stringify(world);
      damageTurret(world, dmg);
      check("REQ-TRN-005  Weiterer Schaden am zerstörten Geschütz ändert nichts", JSON.stringify(world) === before && world.turret.hp === 0);
    }
    {
      const world = fresh();
      damageTrainPart(world, "locomotive", 1000);
      damageTrainPart(world, "wagon", 1000);
      check("REQ-TRN-003  Schritt 5 beendet die Runde nicht (Niederlagenlogik folgt in Schritt 9)", world.status === "running");
    }

    // Zustände, die die Darstellung verwendet (getPartCondition)
    {
      const world = fresh();
      const c0 = getPartCondition(world.wagon);
      damageTrainPart(world, "wagon", 10);
      const c1 = getPartCondition(world.wagon);
      damageTrainPart(world, "wagon", 1000);
      const c2 = getPartCondition(world.wagon);
      const repairing = fresh();
      repairing.wagon.hp = 50;
      repairing.wagon.destroyed = true;
      check("Darstellung   Zustand intakt, beschädigt, zerstört wird aus dem Weltzustand abgeleitet", c0 === "intact" && c1 === "damaged" && c2 === "destroyed");
      check("Darstellung   Zerstörter Wagon mit steigenden HP (Reparatur) gilt weiter als zerstört", getPartCondition(repairing.wagon) === "destroyed");
    }
  }

  // --- Gegner: Spawning, Bewegung, Zielwahl, Kontakt (REQ-ENM-001 bis REQ-ENM-008, REQ-CORE-002)
  {
    const dt = LAYOUT.stepMs;
    const speedStep = (TESTWERTE.enemy.speed * dt) / 1000;
    const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-6;
    // Die Gegnertests prüfen Spawn, Bewegung, Zielwahl und Zugschaden isoliert: Spieler- und
    // Geschützangriff sind hier abgeschaltet (Abkühlung unerreichbar hoch).
    const fresh = (d: Difficulty = "normal"): World => {
      const world = createWorld(d, makeTestRandom());
      world.player.attackCooldownMs = 1e15;
      world.turret.attackCooldownMs = 1e15;
      return world;
    };
    const seq =(values: number[]): (() => number) => {
      let i = 0;
      return () => values[i++ % values.length];
    };
    const enemy = (id: number, x: number, y: number, target: Enemy["target"]): Enemy => ({ id, x, y, hp: TESTWERTE.enemy.hp, target });
    const center = (rect: Rect): { x: number; y: number } => ({ x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 });
    const dist = (e: Enemy, rect: Rect): number => Math.hypot(center(rect).x - e.x, center(rect).y - e.y);
    const run = (world: World, n: number, stepMs: number = dt): void => {
      for (let i = 0; i < n; i++) stepWorld(world, { x: 0, y: 0 }, stepMs);
    };
    const due = (world: World): number => world.spawnPlan.filter((e) => e.atMs <= world.timeMs).reduce((s, e) => s + e.count, 0);

    // 1 und 2: Spawning laut Wellenplan, Gesamtzahl je Schwierigkeitsgrad
    const totals: Record<Difficulty, number> = { gemuetlich: 25, normal: 40, winterhart: 60 };
    for (const d of Object.keys(totals) as Difficulty[]) {
      const world = fresh(d);
      let followsPlan = true;
      let nothingEarly = true;
      for (let i = 0; i < 8000; i++) {
        stepWorld(world, { x: 0, y: 0 }, dt);
        if (world.stats.spawned !== due(world)) followsPlan = false;
        if (world.timeMs < 2990 && world.stats.spawned !== 0) nothingEarly = false;
      }
      check(`REQ-CORE-002 Spawning folgt dem Wellenplan zu jedem Zeitpunkt (${d})`, followsPlan && nothingEarly);
      check(`REQ-DIF-002  Gesamtzahl ${d}: ${totals[d]} Gegner gespawnt`, world.stats.spawned === totals[d] && world.nextSpawnIndex === world.spawnPlan.length);
    }

    // 3: Spawnpositionen
    {
      const world = fresh();
      world.timeMs = 40000;
      spawnEnemies(world);
      const ids = new Set(world.enemies.map((e) => e.id));
      check(
        "REQ-ENM-001  Gegner erscheinen oberhalb des Spielfeldes (y = Spawn-y, nicht sichtbar) mit x im Spawnbereich",
        world.enemies.length === 8 &&
          world.stats.spawned === 8 &&
          ids.size === 8 &&
          world.enemies.every((e) => e.y === LAYOUT.enemySpawnY && e.y + 10 < 0 && e.x >= LAYOUT.enemySpawnXMin && e.x <= LAYOUT.enemySpawnXMax),
      );
      check("REQ-ENM-001  Gruppe erscheint gleichzeitig mit unterschiedlichen x-Positionen", new Set(world.enemies.map((e) => e.x)).size === world.enemies.length);
    }

    // 4: Bewegung auf das Ziel
    {
      const world = fresh();
      world.enemies.push(enemy(1, 300, 100, "wagon"));
      const target = center(world.wagon.rect);
      const start = { x: 300, y: 100 };
      const d0 = dist(world.enemies[0], world.wagon.rect);
      run(world, 10);
      const e = world.enemies[0];
      const progress = d0 - dist(e, world.wagon.rect);
      const cross = (e.x - start.x) * (target.y - start.y) - (e.y - start.y) * (target.x - start.x);
      check("REQ-ENM-005  Gegner bewegt sich mit fester Geschwindigkeit auf sein Ziel zu", near(progress, 10 * speedStep));
      check("REQ-ENM-005  Der Weg ist eine gerade Linie zum Ziel (kürzester Weg)", Math.abs(cross) < 1e-6);
    }

    // 5: Bildraten-Unabhängigkeit
    {
      const a = fresh();
      const b = fresh();
      a.enemies.push(enemy(1, 300, 100, "locomotive"));
      b.enemies.push(enemy(1, 300, 100, "locomotive"));
      run(a, 60, 1000 / 60);
      run(b, 30, 1000 / 30);
      check("REQ-ENM-005  Gegnerbewegung hängt nicht von der Schrittgröße (Bildrate) ab", near(a.enemies[0].x, b.enemies[0].x) && near(a.enemies[0].y, b.enemies[0].y));
    }

    // 6 und 7: Zielwahl
    {
      const wagonA = fresh();
      const wagonB = fresh();
      wagonA.random = seq([0.1, 0.99]);
      wagonB.random = seq([0.9, 0.99]);
      wagonA.timeMs = wagonB.timeMs = 3000;
      spawnEnemies(wagonA);
      spawnEnemies(wagonB);
      const locA = fresh();
      const locB = fresh();
      locA.random = seq([0.1, 0.0]);
      locB.random = seq([0.9, 0.0]);
      locA.timeMs = locB.timeMs = 3000;
      spawnEnemies(locA);
      spawnEnemies(locB);
      check(
        "REQ-ENM-002  Zielwahl ist unabhängig von der Spawnposition (gleiche Wahl bei verschiedener x-Position)",
        wagonA.enemies[0].x !== wagonB.enemies[0].x &&
          wagonA.enemies[0].target === "wagon" &&
          wagonB.enemies[0].target === "wagon" &&
          locA.enemies[0].x !== locB.enemies[0].x &&
          locA.enemies[0].target === "locomotive" &&
          locB.enemies[0].target === "locomotive",
      );
      const world = fresh();
      const count = { locomotive: 0, wagon: 0 };
      for (let i = 0; i < 2000; i++) {
        const t = chooseTarget(world);
        if (t) count[t]++;
      }
      check("REQ-ENM-002  Beide intakten Zugteile werden mit etwa gleicher Wahrscheinlichkeit gewählt", count.locomotive > 800 && count.wagon > 800 && count.locomotive + count.wagon === 2000);
    }
    {
      const noLoco = fresh();
      noLoco.locomotive.destroyed = true;
      const noWagon = fresh();
      noWagon.wagon.hp = 50;
      noWagon.wagon.destroyed = true; // zerstört und in Reparatur: kein gültiges Ziel
      let onlyWagon = true;
      let onlyLoco = true;
      for (let i = 0; i < 300; i++) {
        if (chooseTarget(noLoco) !== "wagon") onlyWagon = false;
        if (chooseTarget(noWagon) !== "locomotive") onlyLoco = false;
      }
      check("REQ-ENM-006  Eine zerstörte Lokomotive wird nie als Ziel gewählt", onlyWagon);
      check("REQ-ENM-006  Ein zerstörter Wagon (auch in Reparatur) wird nie als Ziel gewählt, das Geschütz nie", onlyLoco);
      const none = fresh();
      none.locomotive.destroyed = true;
      none.wagon.destroyed = true;
      let calls = 0;
      none.random = () => {
        calls++;
        return 0.5;
      };
      check("REQ-ENM-008  Ohne intakte Zugteile gibt es kein Ziel (null) und keine Zielsuche", chooseTarget(none) === null && calls === 0);
    }

    // 8: Zielwechsel bei Zerstörung
    {
      const world = fresh();
      world.enemies.push(enemy(1, 480, 300, "wagon"), enemy(2, 1000, 300, "locomotive"));
      damageTrainPart(world, "wagon", 1000);
      const before = { x: world.enemies[0].x, y: world.enemies[0].y };
      run(world, 1);
      const e = world.enemies[0];
      check("REQ-ENM-008  Wird das Ziel zerstört, wählt der Gegner im selben Schritt ein neues intaktes Ziel", e.target === "locomotive" && world.enemies[1].target === "locomotive");
      check("REQ-ENM-008  Die Bewegung geht von der aktuellen Position zum neuen Ziel weiter", near(Math.hypot(e.x - before.x, e.y - before.y), speedStep) && e.x > before.x);
    }
    {
      const world = fresh();
      world.wagon.hp = 10;
      world.enemies.push(enemy(1, 480, 300, "wagon"), enemy(2, 480, 640, "wagon"));
      run(world, 1);
      check(
        "REQ-ENM-008  Zerstört ein Gegner das Ziel eines anderen, wechselt dieser im selben Schritt (auch bei späterer Listenposition)",
        world.wagon.destroyed && world.enemies.length === 1 && world.enemies[0].id === 1 && world.enemies[0].target === "locomotive",
      );
    }
    {
      const world = fresh();
      world.enemies.push(enemy(1, 480, 300, "wagon"));
      damageTrainPart(world, "wagon", 1000);
      damageTrainPart(world, "locomotive", 1000);
      const before = { x: world.enemies[0].x, y: world.enemies[0].y };
      run(world, 5);
      check("REQ-ENM-008  Sind alle Teile zerstört, gibt es kein Ziel mehr, der Gegner bleibt stehen und nichts bricht", world.enemies[0].target === null && world.enemies[0].x === before.x && world.enemies[0].y === before.y);
    }

    // 9 bis 12: Erreichen des Zuges
    for (const part of ["wagon", "locomotive"] as const) {
      const world = fresh();
      const rect = (part === "wagon" ? world.wagon : world.locomotive).rect;
      world.enemies.push(enemy(1, rect.x + rect.w / 2, LAYOUT.trainTopY - 20, part));
      let steps = 0;
      while (world.enemies.length > 0 && steps < 100) {
        run(world, 1);
        steps++;
      }
      const hit = part === "wagon" ? world.wagon : world.locomotive;
      const other = part === "wagon" ? world.locomotive : world.wagon;
      check(`REQ-ENM-003  Gegner erreicht ${part === "wagon" ? "den Wagon" : "die Lokomotive"} nach etwa 30 Schritten`, steps >= 29 && steps <= 32);
      check(`REQ-ENM-003  Beim Erreichen ${part === "wagon" ? "des Wagons" : "der Lokomotive"} werden genau 10 HP Schaden verursacht`, hit.hp === 90 && other.hp === 100 && !hit.destroyed);
      check(
        `REQ-ENM-003  Gegner verschwindet, zählt als erreicht, Ereignis und Statistik (${part})`,
        world.enemies.length === 0 && world.stats.reachedTrain === 1 && world.stats.damageByPart[part] === 10 && world.stats.damageByPart[part === "wagon" ? "locomotive" : "wagon"] === 0,
      );
    }
    {
      const world = fresh();
      world.enemies.push(enemy(1, 480, 625, "wagon"));
      run(world, 1);
      check("REQ-ENM-003  Das Ereignis enemyReachedTrain wird erzeugt", world.events.some((e) => e.type === "enemyReachedTrain" && e.enemyId === 1 && e.part === "wagon"));
      run(world, 300);
      check("REQ-ENM-003  Ein Gegner verursacht nicht mehrfach Schaden (auch nach 300 weiteren Schritten)", world.wagon.hp === 90 && world.stats.reachedTrain === 1);
    }
    {
      const world = fresh();
      world.enemies.push(enemy(1, 480, 625, "wagon"), enemy(2, 500, 625, "wagon"), enemy(3, 800, 625, "locomotive"));
      run(world, 1);
      check("REQ-ENM-003  Jeder Gegner verursacht genau einmal 10 Schaden (2 am Wagon: 80, 1 an der Lokomotive: 90)", world.wagon.hp === 80 && world.locomotive.hp === 90 && world.stats.reachedTrain === 3 && world.enemies.length === 0);
    }
    {
      const world = fresh();
      world.wagon.hp = 50;
      world.wagon.destroyed = true;
      world.enemies.push(enemy(1, 480, 650, "wagon"));
      run(world, 1);
      check("REQ-ENM-006  Ein Gegner im Rechteck eines zerstörten Teils (in Reparatur) verursacht dort keinen Schaden und wählt neu", world.wagon.hp === 50 && world.stats.damageByPart.wagon === 0 && world.enemies[0].target === "locomotive");
    }

    // 13: Statistik im Gesamtlauf ohne Verteidigung
    {
      const world = fresh("gemuetlich");
      run(world, 9000);
      const damage = world.stats.damageByPart.locomotive + world.stats.damageByPart.wagon;
      check(
        "REQ-STA-001  Statistik im Gesamtlauf: 25 gespawnt, 20 erreicht, Schaden 200 = 10 je Ankunft, beide Teile zerstört",
        world.stats.spawned === 25 && world.stats.reachedTrain === 20 && damage === 200 && world.locomotive.destroyed && world.wagon.destroyed && world.turret.destroyed,
      );
      check("REQ-ENM-008  Gegner ohne Ziel bleiben übrig, ohne weiteren Schaden (5 Gegner, kein Ziel)", world.enemies.length === 5 && world.enemies.every((e) => e.target === null) && world.status === "running");
    }

    // 14: Spieler und Gegner behindern sich nicht
    {
      const near1 = fresh();
      const far = fresh();
      near1.player.x = 500;
      near1.player.y = 250;
      far.player.x = 1200;
      far.player.y = 100;
      near1.enemies.push(enemy(1, 500, 250, "wagon"));
      far.enemies.push(enemy(1, 500, 250, "wagon"));
      run(near1, 60);
      run(far, 60);
      check("REQ-PLR-004  Ein Spieler auf dem Gegnerweg verändert die Gegnerbewegung nicht", near(near1.enemies[0].x, far.enemies[0].x) && near(near1.enemies[0].y, far.enemies[0].y));
      const walker = fresh();
      const alone = fresh();
      walker.enemies.push(enemy(1, 640, 360, "wagon"), enemy(2, 650, 350, "locomotive"));
      for (let i = 0; i < 60; i++) {
        stepWorld(walker, { x: 1, y: 0 }, dt);
        stepWorld(alone, { x: 1, y: 0 }, dt);
      }
      check("REQ-PLR-004  Gegner auf dem Spieler behindern ihn nicht und bleiben in der Liste (Überschneidung erlaubt)", near(walker.player.x, alone.player.x) && near(walker.player.y, alone.player.y) && walker.enemies.length === 2);
    }
    check("REQ-ENM-007  Alle Gegner haben denselben Typ (feste HP-Konfiguration)", (() => {
      const world = fresh();
      world.timeMs = 200000;
      spawnEnemies(world);
      return world.enemies.length === 40 && world.enemies.every((e) => e.hp === TESTWERTE.enemy.hp);
    })());
  }

  // --- Automatische Angriffe (REQ-CMB-001 bis REQ-CMB-005)
  {
    const dt = LAYOUT.stepMs;
    const range = TESTWERTE.playerRange;
    const fresh = (): World => createWorld("normal", makeTestRandom());
    const enemyAt = (id: number, x: number, y: number, hp: number = TESTWERTE.enemy.hp): Enemy => ({ id, x, y, hp, target: "wagon" });
    const playerOnly = (): World => {
      const world = fresh();
      world.turret.destroyed = true; // Geschütz funktionslos, nur der Spieler greift an
      return world;
    };
    const turretOnly = (): World => {
      const world = fresh();
      world.player.attackCooldownMs = 1e15; // Spielerangriff abgeschaltet, nur das Geschütz greift an
      return world;
    };
    const shots = (world: World, source: "player" | "turret"): number => world.events.filter((e) => e.type === "shot" && e.source === source).length;
    const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-6;

    // Spielerangriff
    {
      const world = playerOnly();
      const e = enemyAt(1, world.player.x + 50, world.player.y);
      world.enemies.push(e);
      runCombat(world, dt);
      check("REQ-CMB-004  Spieler greift einen Gegner innerhalb der Reichweite an (Soforttreffer, 3 auf 2 HP)", e.hp === TESTWERTE.enemy.hp - TESTWERTE.player.damage && shots(world, "player") === 1 && shots(world, "turret") === 0);
    }
    {
      const world = playerOnly();
      const out = enemyAt(1, world.player.x + range + 10, world.player.y);
      world.enemies.push(out);
      runCombat(world, dt);
      check("REQ-CMB-004  Spieler greift außerhalb der Reichweite nicht an", out.hp === 3 && world.events.length === 0);
      const edge = playerOnly();
      const atEdge = enemyAt(1, edge.player.x + range, edge.player.y);
      edge.enemies.push(atEdge);
      runCombat(edge, dt);
      const beyond = playerOnly();
      const justOut = enemyAt(1, beyond.player.x + range + 0.01, beyond.player.y);
      beyond.enemies.push(justOut);
      runCombat(beyond, dt);
      check("REQ-CMB-004  Reichweitengrenze: genau 90 LE wird getroffen, 90,01 LE nicht", atEdge.hp === 2 && justOut.hp === 3);
    }
    {
      const world = playerOnly();
      const far = enemyAt(1, world.player.x + 80, world.player.y);
      const closest = enemyAt(2, world.player.x, world.player.y + 40);
      const mid = enemyAt(3, world.player.x - 60, world.player.y);
      world.enemies.push(far, closest, mid);
      runCombat(world, dt);
      check("REQ-CMB-004  Spieler wählt den nächsten Gegner (Einzelziel: nur dieser wird getroffen)", closest.hp === 2 && far.hp === 3 && mid.hp === 3 && shots(world, "player") === 1);
      const tie = playerOnly();
      const a = enemyAt(7, tie.player.x + 50, tie.player.y);
      const b = enemyAt(5, tie.player.x - 50, tie.player.y);
      tie.enemies.push(a, b);
      runCombat(tie, dt);
      check("REQ-CMB-004  Bei gleichem Abstand gewinnt die kleinere Gegner-ID (TECH-19)", b.hp === 2 && a.hp === 3);
    }
    {
      const world = fresh();
      world.player.y = 14;
      const hidden = enemyAt(1, world.player.x, -10);
      world.enemies.push(hidden);
      runCombat(world, dt);
      check("REQ-CMB-002  Gegner außerhalb des sichtbaren Spielfeldes (oberhalb) sind kein gültiges Ziel, für beide Quellen", hidden.hp === 3 && world.events.length === 0);
    }

    // Geschützangriff
    {
      const world = turretOnly();
      const e = enemyAt(1, 900, 300);
      world.enemies.push(e);
      runCombat(world, dt);
      check("REQ-CMB-002  Geschütz greift unabhängig vom Spieler an (Spieler außer Reichweite und ohne Angriff)", e.hp === 2 && shots(world, "turret") === 1 && shots(world, "player") === 0);
    }
    {
      const world = fresh();
      world.player.attackCooldownMs = 500;
      const e = enemyAt(1, world.player.x + 10, world.player.y);
      world.enemies.push(e);
      runCombat(world, dt);
      check("REQ-CMB-001  Abkühlungen sind unabhängig: Spieler noch nicht bereit, Geschütz schießt trotzdem", e.hp === 2 && shots(world, "turret") === 1 && shots(world, "player") === 0);
      const other = fresh();
      other.turret.attackCooldownMs = 500;
      const f = enemyAt(1, other.player.x + 10, other.player.y);
      other.enemies.push(f);
      runCombat(other, dt);
      check("REQ-CMB-001  Umgekehrt: Geschütz noch nicht bereit, Spieler schießt trotzdem", f.hp === 2 && shots(other, "player") === 1 && shots(other, "turret") === 0);
    }
    {
      let reached = true;
      for (const [x, y] of [[0, 0], [LAYOUT.field.width, 0], [0, LAYOUT.field.height - 1], [LAYOUT.field.width, LAYOUT.field.height - 1], [LAYOUT.field.width / 2, 1]]) {
        const world = turretOnly();
        const e = enemyAt(1, x, y);
        world.enemies.push(e);
        runCombat(world, dt);
        if (e.hp !== 2) reached = false;
      }
      check("REQ-CMB-002  Geschütz erreicht Gegner im gesamten Spielfeld (alle Ecken und Mitte oben)", reached);
      const world = turretOnly();
      const nearTurret = enemyAt(2, 700, 400);
      const farAway = enemyAt(1, 10, 10);
      world.enemies.push(farAway, nearTurret);
      runCombat(world, dt);
      check("REQ-CMB-002  Geschütz wählt den nächsten Gegner (Bezugspunkt Geschützposition)", nearTurret.hp === 2 && farAway.hp === 3);
    }
    {
      const destroyed = turretOnly();
      destroyed.turret.destroyed = true;
      const e1 = enemyAt(1, 900, 300);
      destroyed.enemies.push(e1);
      runCombat(destroyed, dt);
      check("REQ-CMB-002  Zerstörtes Geschütz greift nicht an", e1.hp === 3 && destroyed.events.length === 0);

      const noWagon = turretOnly();
      damageTrainPart(noWagon, "wagon", 1000);
      noWagon.events.length = 0;
      const e2 = enemyAt(1, 900, 300);
      noWagon.enemies.push(e2);
      runCombat(noWagon, dt);
      check("REQ-CMB-002  Zerstörter Wagon bedeutet zerstörtes Geschütz: kein Angriff", noWagon.turret.destroyed && e2.hp === 3 && noWagon.events.length === 0);

      const damagedWagon = turretOnly();
      damageTrainPart(damagedWagon, "wagon", 99);
      damagedWagon.events.length = 0;
      const e3 = enemyAt(1, 900, 300);
      damagedWagon.enemies.push(e3);
      runCombat(damagedWagon, dt);
      check("REQ-CMB-002  Beschädigter, nicht zerstörter Wagon: Geschütz greift an", e3.hp === 2);

      const damagedTurret = turretOnly();
      damageTurret(damagedTurret, 15);
      const e4 = enemyAt(1, 900, 300);
      damagedTurret.enemies.push(e4);
      runCombat(damagedTurret, dt);
      check("REQ-CMB-002  Beschädigtes Geschütz (5 HP) greift weiterhin an", e4.hp === 2);

      const repaired = turretOnly();
      repaired.turret.destroyed = true;
      runCombat(repaired, dt);
      repaired.turret.destroyed = false;
      const e5 = enemyAt(1, 900, 300);
      repaired.enemies.push(e5);
      runCombat(repaired, dt);
      check("REQ-CMB-002  Wieder funktionsfähiges Geschütz ist sofort bereit", e5.hp === 2);
    }

    // Beide Quellen, Besiegen, Zählung
    {
      const world = fresh();
      const e = enemyAt(1, world.player.x + 10, world.player.y);
      world.enemies.push(e);
      runCombat(world, dt);
      check("REQ-CMB-001  Beide Quellen können denselben Gegner im selben Schritt treffen (3 auf 1 HP)", e.hp === 1 && shots(world, "player") === 1 && shots(world, "turret") === 1);
    }
    {
      const world = fresh();
      const e = enemyAt(1, world.player.x + 10, world.player.y, 2);
      world.enemies.push(e);
      runCombat(world, dt);
      check(
        "REQ-CMB-005  Tödlicher Treffer: Gegner wird bei 0 HP entfernt, der Kill geht an die Quelle des letzten Treffers (Geschütz)",
        world.enemies.length === 0 && world.stats.killsByTurret === 1 && world.stats.killsByPlayer === 0 && world.events.some((ev) => ev.type === "enemyDefeated" && ev.enemyId === 1 && ev.source === "turret"),
      );
      const solo = fresh();
      solo.enemies.push(enemyAt(1, solo.player.x + 10, solo.player.y, 1));
      runCombat(solo, dt);
      check("REQ-CMB-005  Ein Gegner mit 1 HP wird vom Spieler besiegt und genau einmal gezählt (das Geschütz hat kein Ziel mehr)", solo.enemies.length === 0 && solo.stats.killsByPlayer === 1 && solo.stats.killsByTurret === 0 && shots(solo, "turret") === 0);
      const alive = fresh();
      const e3 = enemyAt(1, alive.player.x + 10, alive.player.y, 5);
      alive.enemies.push(e3);
      runCombat(alive, dt);
      check("REQ-CMB-005  Ein Gegner mit Rest-HP bleibt bestehen, nicht gezählt, HP nie negativ", alive.enemies.length === 1 && e3.hp === 3 && alive.stats.killsByPlayer + alive.stats.killsByTurret === 0);
    }
    {
      const world = turretOnly();
      world.enemies.push(enemyAt(1, 480, 600, 1));
      for (let i = 0; i < 100; i++) stepWorld(world, { x: 0, y: 0 }, dt);
      check("REQ-CMB-005  Ein besiegter Gegner richtet keinen Zugschaden an", world.wagon.hp === 100 && world.locomotive.hp === 100 && world.stats.reachedTrain === 0 && world.stats.killsByTurret === 1);
    }

    // Angriffsintervalle, bildratenunabhängig
    for (const source of ["player", "turret"] as const) {
      const results: { stepMs: number; count: number; gaps: number[] }[] = [];
      for (const stepMs of [1000 / 120, 1000 / 60, 1000 / 30]) {
        const world = source === "player" ? playerOnly() : turretOnly();
        const e = enemyAt(1, world.player.x + 5, world.player.y, 1_000_000);
        world.enemies.push(e);
        const times: number[] = [];
        let t = 0;
        while (t < 10000) {
          world.events.length = 0;
          runCombat(world, stepMs);
          t += stepMs;
          if (shots(world, source) > 0 && t <= 10000 + 1e-6) times.push(t); // nur Schüsse innerhalb von 10 s zählen
        }
        results.push({ stepMs, count: times.length, gaps: times.slice(1).map((v, i) => v - times[i]) });
      }
      const interval = source === "player" ? TESTWERTE.player.cooldownMs : TESTWERTE.turret.cooldownMs;
      check(
        `REQ-CMB-001  Feuerrate ${source === "player" ? "des Spielers" : "des Geschützes"} ist bei 120, 60 und 30 Schritten pro Sekunde gleich (erster Schuss sofort, dann alle 1000 ms: 11 Schüsse in 10 s)`,
        results.every((r) => r.count === 11),
      );
      check(
        `REQ-CMB-001  Abstand zwischen zwei Schüssen entspricht dem Intervall (${interval} ms, Schrittgröße als Toleranz)`,
        results.every((r) => r.gaps.every((gap) => Math.abs(gap - interval) <= r.stepMs + 1e-6)),
      );
    }
    {
      const world = fresh();
      world.enemies.push(enemyAt(1, world.player.x, world.player.y, 100));
      for (let i = 0; i < 10; i++) runCombat(world, dt);
      check("REQ-CMB-001  Nach dem Schuss läuft die Abkühlung pro Schritt herunter (ein Schuss, dann Intervall minus 10 Schritte)", near(world.player.attackCooldownMs, TESTWERTE.player.cooldownMs - 10 * dt) && world.enemies[0].hp === 100 - 2 * 1);
      const idle = fresh();
      for (let i = 0; i < 300; i++) runCombat(idle, dt);
      idle.enemies.push(enemyAt(1, idle.player.x, idle.player.y, 100));
      runCombat(idle, dt);
      check("REQ-CMB-001  Nach langer Wartezeit ohne Ziel: sofort ein einziger Schuss je Quelle", shots(idle, "player") === 1 && shots(idle, "turret") === 1 && idle.enemies[0].hp === 98);
    }

    // Spielende und Gesamtlauf
    for (const status of ["won", "lost"] as const) {
      const world = fresh();
      world.status = status;
      world.enemies.push(enemyAt(1, world.player.x + 10, world.player.y), enemyAt(2, 900, 300));
      const before = JSON.stringify(world);
      for (let i = 0; i < 500; i++) stepWorld(world, { x: 0, y: 0 }, dt);
      check(`REQ-WL-005   Keine Angriffe und kein Schaden nach Spielende (${status})`, JSON.stringify(world) === before && world.stats.killsByPlayer + world.stats.killsByTurret === 0);
    }
    {
      const world = fresh();
      for (let i = 0; i < 9000; i++) stepWorld(world, { x: 0, y: 0 }, dt);
      const s = world.stats;
      check(
        "REQ-STA-001  Gesamtlauf mit Verteidigung: gespawnt = Spieler-Kills + Geschütz-Kills + Zug erreicht + noch aktiv",
        s.spawned === 40 && s.killsByPlayer + s.killsByTurret + s.reachedTrain + world.enemies.length === s.spawned && s.killsByTurret > 0,
      );
      check("REQ-DIF-002  Mit Verteidigung kommen weniger Gegner durch als ohne (weniger als 20 am Zug, Schaden entsprechend 10 je Ankunft)", s.reachedTrain < 20 && s.damageByPart.locomotive + s.damageByPart.wagon === s.reachedTrain * CONFIRMED.enemyDamage);
    }
  }

  // --- Zugausrichtung (D-061)
  {
    const world = createWorld("normal", makeTestRandom());
    const loco = world.locomotive.rect;
    const wagon = world.wagon.rect;
    check("REQ-TRN-006  Der Zug fährt von links nach rechts: Front zeigt nach rechts (Konfiguration)", LAYOUT.trainFacing === "right");
    check("REQ-TRN-006  Die Lokomotive steht ganz rechts, alle Wagen links von ihr", loco.x >= wagon.x + wagon.w && loco.x > wagon.x && loco.x + loco.w <= LAYOUT.field.width);
    check("REQ-TRN-006  Das Geschütz sitzt auf dem Wagon und damit links von der Lokomotive", inside(world.turret.x, world.turret.y, wagon) && world.turret.x < loco.x);
    check(
      "REQ-TRN-006  Reparaturzonen liegen über ihrem Teil (Wagon links, Lokomotive rechts)",
      world.wagon.zone.x === wagon.x && world.wagon.zone.w === wagon.w && world.locomotive.zone.x === loco.x && world.locomotive.zone.w === loco.w && world.wagon.zone.x < world.locomotive.zone.x && world.wagon.zone.y + world.wagon.zone.h === LAYOUT.trainTopY,
    );
    // Schadenszuordnung folgt dem Rechteck des Zielteils
    const hitWagon = createWorld("normal", makeTestRandom());
    hitWagon.player.attackCooldownMs = hitWagon.turret.attackCooldownMs = 1e15;
    hitWagon.enemies.push({ id: 1, x: wagon.x + wagon.w / 2, y: wagon.y + 5, hp: 3, target: "wagon" });
    stepWorld(hitWagon, { x: 0, y: 0 }, LAYOUT.stepMs);
    const hitLoco = createWorld("normal", makeTestRandom());
    hitLoco.player.attackCooldownMs = hitLoco.turret.attackCooldownMs = 1e15;
    hitLoco.enemies.push({ id: 1, x: loco.x + loco.w / 2, y: loco.y + 5, hp: 3, target: "locomotive" });
    stepWorld(hitLoco, { x: 0, y: 0 }, LAYOUT.stepMs);
    check("REQ-TRN-006  Schadenszuordnung: ein Gegner am linken Teil trifft den Wagon, am rechten Teil die Lokomotive", hitWagon.wagon.hp === 90 && hitWagon.locomotive.hp === 100 && hitLoco.locomotive.hp === 90 && hitLoco.wagon.hp === 100);
    const toLoco = createWorld("normal", makeTestRandom());
    toLoco.player.attackCooldownMs = toLoco.turret.attackCooldownMs = 1e15;
    toLoco.enemies.push({ id: 1, x: 640, y: 300, hp: 3, target: "locomotive" }, { id: 2, x: 640, y: 300, hp: 3, target: "wagon" });
    stepWorld(toLoco, { x: 0, y: 0 }, LAYOUT.stepMs);
    check("REQ-TRN-006  Gegner mit Ziel Lokomotive laufen nach rechts, mit Ziel Wagon nach links", toLoco.enemies[0].x > 640 && toLoco.enemies[1].x < 640);
  }

  // --- Reparatur (REQ-REP-001 bis REQ-REP-006, REQ-PLR-003)
  {
    const dt = LAYOUT.stepMs;
    const stepMs = CONFIRMED.repairStepMs;
    const fresh = (): World => {
      const world = createWorld("normal", makeTestRandom());
      world.spawnPlan = []; // keine Gegner: reine Reparaturprüfung
      return world;
    };
    const intoZone = (world: World, part: "wagon" | "locomotive"): void => {
      const z = world[part].zone;
      world.player.x = z.x + z.w / 2;
      world.player.y = z.y + 50;
    };
    const outOfZones = (world: World): void => {
      world.player.x = 640;
      world.player.y = 300;
    };
    const rep = (world: World, ms: number, step: number = dt): void => {
      for (let t = 0; t < ms - 1e-9; t += step) updateRepair(world, step);
    };

    // Beginn innerhalb der Zone, nicht außerhalb
    {
      const world = fresh();
      world.wagon.hp = 50;
      intoZone(world, "wagon");
      rep(world, 4900);
      const before = world.wagon.hp;
      rep(world, 200);
      check("REQ-REP-003  Reparatur beginnt in der Zone: nach 4,9 s noch keine HP, nach 5,1 s genau +5", before === 50 && world.wagon.hp === 55 && world.activeRepair === "wagon");
    }
    {
      const world = fresh();
      world.wagon.hp = 50;
      world.locomotive.hp = 50;
      outOfZones(world);
      rep(world, 30000);
      check("REQ-REP-003  Außerhalb der Zonen findet keine Reparatur statt", world.wagon.hp === 50 && world.locomotive.hp === 50 && world.wagon.repairProgressMs === 0 && world.activeRepair === null && world.stats.repairMsByPart.wagon === 0);
    }
    {
      const world = fresh();
      intoZone(world, "wagon");
      rep(world, 20000);
      check("REQ-REP-002  Ein vollständig intaktes Teil wird nicht repariert (kein Fortschritt, keine aktive Reparatur)", world.wagon.hp === 100 && world.wagon.repairProgressMs === 0 && world.activeRepair === null);
    }

    // Pause und Fortsetzen
    {
      const world = fresh();
      world.wagon.hp = 50;
      intoZone(world, "wagon");
      rep(world, 3000);
      const progress = world.wagon.repairProgressMs;
      outOfZones(world);
      rep(world, 10000);
      check("REQ-REP-003  Verlassen der Zone pausiert: Fortschritt bleibt exakt erhalten, keine HP", world.wagon.repairProgressMs === progress && world.wagon.hp === 50 && progress > 2900 && progress < 3100 && world.activeRepair === null);
      intoZone(world, "wagon");
      rep(world, 1900);
      const mid = world.wagon.hp;
      rep(world, 200);
      check("REQ-REP-003  Wiedereintritt setzt fort: nach insgesamt 5 s Anwesenheit (3 s + 2 s) +5 HP", mid === 50 && world.wagon.hp === 55);
      // Innerhalb der Zone frei bewegen
      world.player.x = world.wagon.zone.x + 5;
      world.player.y = world.wagon.zone.y + 5;
      const p1 = world.wagon.repairProgressMs;
      rep(world, 1000);
      world.player.x = world.wagon.zone.x + world.wagon.zone.w - 5;
      rep(world, 1000);
      check("REQ-REP-003  Bewegung innerhalb der Zone unterbricht die Reparatur nicht", world.wagon.repairProgressMs > p1 + 1900);
    }

    // Rate: 5 HP alle 5 s, bildratenunabhängig
    {
      const world = fresh();
      world.wagon.hp = 0;
      world.wagon.destroyed = true;
      intoZone(world, "wagon");
      const gains: number[] = [];
      let t = 0;
      let last = world.wagon.hp;
      let steps = 0;
      while (world.wagon.destroyed && steps < 20000) {
        updateRepair(world, dt);
        t += dt;
        steps++;
        if (world.wagon.hp !== last) {
          gains.push(world.wagon.hp - last);
          last = world.wagon.hp;
        }
      }
      check("REQ-REP-003  Genau 5 HP je Reparaturschritt (20 Schritte von 0 auf 100)", gains.length === 20 && gains.every((g) => g === 5));
      check("REQ-REP-003  Eine vollständige Reparatur von 0 auf 100 HP dauert 100 Sekunden", Math.abs(t - 100000) <= dt + 1e-6);
    }
    {
      const counts: number[] = [];
      for (const step of [1000 / 120, 1000 / 60, 1000 / 30]) {
        const world = fresh();
        world.wagon.hp = 20;
        intoZone(world, "wagon");
        rep(world, 50000, step);
        counts.push(world.wagon.hp);
      }
      check("REQ-REP-003  Reparaturfortschritt ist bildratenunabhängig (nach 50 s bei 120, 60, 30 Schritten/s: je 20 + 50 = 70 HP)", counts.every((c) => c === 70));
      const big = fresh();
      big.wagon.hp = 50;
      intoZone(big, "wagon");
      updateRepair(big, 12000);
      check("REQ-REP-003  Ein sehr großer Zeitschritt (12 s) liefert 2 Schritte (+10 HP) und behält 2 s Rest", big.wagon.hp === 60 && Math.abs(big.wagon.repairProgressMs - 2000) < 1e-6);
    }

    // Nur ein Teil gleichzeitig
    {
      const world = fresh();
      world.wagon.hp = 50;
      world.locomotive.hp = 50;
      intoZone(world, "wagon");
      rep(world, 10000);
      check("REQ-REP-004  Es wird nur das Teil in der Zone des Spielers repariert (Wagon 60, Lokomotive unverändert)", world.wagon.hp === 60 && world.locomotive.hp === 50 && world.locomotive.repairProgressMs === 0);
      intoZone(world, "locomotive");
      rep(world, 5100);
      check("REQ-REP-004  Wechsel in die andere Zone: nun nur die Lokomotive (60), der Wagon behält seinen Stand", world.locomotive.hp === 55 && world.wagon.hp === 60);
    }
    {
      const world = fresh();
      world.wagon.hp = 50;
      world.locomotive.hp = 50;
      world.locomotive.zone = { ...world.wagon.zone }; // künstlich überlappende Zonen (Prototyp-Konfiguration hat keine)
      intoZone(world, "wagon");
      let bothGrew = false;
      for (let i = 0; i < 2000; i++) {
        const w0 = world.wagon.repairProgressMs + world.wagon.hp;
        const l0 = world.locomotive.repairProgressMs + world.locomotive.hp;
        updateRepair(world, dt);
        if (world.wagon.repairProgressMs + world.wagon.hp > w0 && world.locomotive.repairProgressMs + world.locomotive.hp > l0) bothGrew = true;
      }
      check("REQ-REP-004  Bei überlappenden Zonen wird nie mehr als ein Teil gleichzeitig repariert (Reihenfolge Wagon, Lokomotive)", !bothGrew && world.wagon.hp > 50 && world.locomotive.hp === 50);
    }

    // Zerstört bleibt zerstört, Abschluss
    {
      const world = fresh();
      damageTrainPart(world, "wagon", 1000);
      world.events.length = 0;
      intoZone(world, "wagon");
      rep(world, 50000);
      check("REQ-REP-005  Ein zerstörter Wagon bleibt bei halber Reparatur (50 HP) zerstört, ebenso das Geschütz, ohne Ereignis partRepaired", world.wagon.hp === 50 && world.wagon.destroyed && world.turret.destroyed && world.turret.hp === 0 && !world.events.some((e) => e.type === "partRepaired"));
      let picksWagon = false;
      for (let i = 0; i < 100; i++) if (chooseTarget(world) === "wagon") picksWagon = true;
      check("REQ-REP-006  Ein zerstörter Wagon in Reparatur ist kein gültiges Gegnerziel", !picksWagon && !isTurretFunctional(world));
      rep(world, 49000);
      check("REQ-REP-005  Kurz vor dem Abschluss (nach 99 s: 95 HP) ist der Wagon noch zerstört", world.wagon.hp === 95 && world.wagon.destroyed);
      rep(world, 6000);
      check("REQ-REP-005  Mit dem vollständigen Abschluss (100 HP) ist der Wagon wieder intakt und betriebsbereit", world.wagon.hp === 100 && !world.wagon.destroyed && getPartCondition(world.wagon) === "intact" && world.events.some((e) => e.type === "partRepaired" && e.part === "wagon"));
      let picksAgain = false;
      for (let i = 0; i < 200; i++) if (chooseTarget(world) === "wagon") picksAgain = true;
      check("REQ-REP-006  Der vollständig reparierte Wagon ist wieder ein gültiges Gegnerziel", picksAgain);
      check("REQ-REP-005  Nach dem Abschluss ist die Reparatur beendet (Zähler 0, keine aktive Reparatur nach dem nächsten Schritt)", world.wagon.repairProgressMs === 0 && (updateRepair(world, dt), world.activeRepair === null));
    }
    {
      const world = fresh();
      damageTrainPart(world, "locomotive", 1000);
      intoZone(world, "locomotive");
      rep(world, 100000 + 100);
      check("REQ-REP-005  Auch die Lokomotive wird nach 100 s wieder intakt (ohne Zusatzwirkung auf Wagon und Geschütz)", world.locomotive.hp === 100 && !world.locomotive.destroyed && world.wagon.hp === 100 && !world.turret.destroyed && world.turret.hp === 20);
    }

    // Wagon und Geschütz
    {
      const world = fresh();
      world.turret.hp = 3; // früherer Zustand irrelevant
      damageTrainPart(world, "wagon", 1000);
      intoZone(world, "wagon");
      rep(world, 100000 + 100);
      check("REQ-REP-005  Die Reparatur des zerstörten Wagons stellt das Geschütz vollständig wieder her (20/20) und aktiviert es", world.wagon.hp === 100 && world.turret.hp === 20 && !world.turret.destroyed && isTurretFunctional(world));
      const enemy1: Enemy = { id: 1, x: 900, y: 300, hp: 3, target: "wagon" };
      world.enemies.push(enemy1);
      world.player.attackCooldownMs = 1e15;
      runCombat(world, dt);
      check("REQ-REP-005  Das wiederhergestellte Geschütz greift sofort wieder an", enemy1.hp === 2);
    }
    {
      const world = fresh();
      damageTurret(world, 5);
      damageTrainPart(world, "wagon", 40);
      intoZone(world, "wagon");
      rep(world, 40000);
      check("REQ-REP-005  Ein nur beschädigter Wagon bleibt vom Geschütz unabhängig: Reparatur des Wagons ändert das Geschütz nicht", world.wagon.hp === 100 && world.turret.hp === 15 && !world.turret.destroyed);
    }
    {
      const world = fresh();
      damageTrainPart(world, "wagon", 1000);
      damageTrainPart(world, "locomotive", 50);
      intoZone(world, "locomotive");
      rep(world, 50000);
      check("REQ-REP-005  Die Reparatur der Lokomotive stellt das Geschütz nicht her (nur die Wagon-Reparatur)", world.locomotive.hp === 100 && world.wagon.destroyed && world.turret.destroyed);
    }

    // Kostenlos, Statistik
    {
      const world = fresh();
      world.wagon.hp = 50;
      intoZone(world, "wagon");
      rep(world, 10000);
      check("REQ-REP-001  Reparatur ist kostenlos: kein Ressourcenzustand vorhanden oder nötig", !("resources" in world) && world.wagon.hp === 60);
      check("REQ-STA-001  Reparaturzeit wird je Zugteil als aktive Reparaturzeit erfasst (10 s am Wagon, 0 an der Lokomotive)", Math.abs(world.stats.repairMsByPart.wagon - 10000) < 20 && world.stats.repairMsByPart.locomotive === 0);
    }

    // Integration über stepWorld: Spielerangriff läuft während der Reparatur
    {
      const world = fresh();
      world.wagon.hp = 50;
      intoZone(world, "wagon");
      // Der Gegner steht 85 LE über dem Spieler (in Reichweite) und läuft zum Wagon, wird aber nach 3 Schüssen besiegt, bevor er ankommt.
      const target: Enemy = { id: 1, x: world.player.x + 30, y: world.player.y - 80, hp: 3, target: "wagon" };
      world.enemies.push(target);
      world.turret.destroyed = true; // nur der Spieler kann schießen
      stepWorld(world, { x: 0, y: 0 }, dt);
      check(
        "REQ-REP-003  Der Spieler greift während der Reparatur weiterhin automatisch an (Treffer und Reparaturfortschritt im selben Schritt)",
        target.hp === 2 && world.events.some((e) => e.type === "shot" && e.source === "player") && world.activeRepair === "wagon" && world.wagon.repairProgressMs > 0,
      );
      for (let i = 0; i < 400; i++) stepWorld(world, { x: 0, y: 0 }, dt);
      check("REQ-REP-003  Über stepWorld: Fortschritt und Kills laufen gleichzeitig (Wagon +5 HP nach 5 s, Gegner besiegt)", world.wagon.hp >= 55 && world.stats.killsByPlayer === 1);
    }
    for (const status of ["won", "lost"] as const) {
      const world = fresh();
      world.status = status;
      world.wagon.hp = 50;
      intoZone(world, "wagon");
      const before = JSON.stringify(world);
      for (let i = 0; i < 600; i++) stepWorld(world, { x: 0, y: 0 }, dt);
      check(`REQ-WL-005   Nach Spielende wird nicht mehr repariert (${status})`, JSON.stringify(world) === before && world.wagon.hp === 50);
    }
    {
      // Bewegung des Spielers (Schritt 4) führt in die Zone: Der Spieler kann beide Zonen erreichen.
      const world = fresh();
      world.wagon.hp = 50;
      world.player.x = 640;
      world.player.y = 360;
      for (let i = 0; i < 95; i++) stepWorld(world, { x: -1, y: 1 }, dt); // schräg nach links unten, etwa 1,6 s
      const inWagonZone = world.player.x >= world.wagon.zone.x && world.player.x <= world.wagon.zone.x + world.wagon.zone.w && world.player.y >= world.wagon.zone.y;
      check("REQ-PLR-003  Der Spieler erreicht die Reparaturzone durch Laufen und die Reparatur beginnt ohne Taste", inWagonZone && world.activeRepair === "wagon" && world.wagon.repairProgressMs > 0);
    }
  }

  // --- Konfiguration (REQ-ARC-004)
  check("REQ-ARC-004  Zwei Welten teilen keine Objekte der Konfiguration", (() => {
    const a = createWorld("normal");
    const b = createWorld("normal");
    a.wagon.hp = 1;
    a.wagon.rect.x = 0;
    return b.wagon.hp === 100 && b.wagon.rect.x === LAYOUT.wagonRect.x && LAYOUT.wagonRect.x === 340;
  })());

  log("");
  log(`Ergebnis: ${passed} bestanden, ${failed} fehlgeschlagen, ${passed + failed} gesamt`);
  log(failed === 0 ? "GESAMT: PASS" : "GESAMT: FAIL");
  return { passed, failed };
}

// Direkter Aufruf in Node. Im Browser (spätere Schritte) wird runSelfTest() aufgerufen.
if (typeof process !== "undefined") {
  const result = runSelfTest();
  if (result.failed > 0) process.exit(1);
}
