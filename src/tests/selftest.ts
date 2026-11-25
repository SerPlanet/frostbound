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
