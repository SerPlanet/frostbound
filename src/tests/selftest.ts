// Selbsttest ohne Framework (REQ-TST-003, TECH-13).
// Ausführen: node src/tests/selftest.ts   (Node 22, native TypeScript-Unterstützung)
// Importiert nur game/ und config.ts, keine Browser-APIs, kein Phaser.

import { LAYOUT, TESTWERTE } from "../config.ts";
import { createWorld, stepWorld } from "../game/world.ts";
import type { Difficulty, PlayerInput, Rect, World } from "../game/types.ts";

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

  // --- Konfiguration (REQ-ARC-004)
  check("REQ-ARC-004  Zwei Welten teilen keine Objekte der Konfiguration", (() => {
    const a = createWorld("normal");
    const b = createWorld("normal");
    a.wagon.hp = 1;
    a.wagon.rect.x = 0;
    return b.wagon.hp === 100 && b.wagon.rect.x === LAYOUT.wagonRect.x && LAYOUT.wagonRect.x === 660;
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
