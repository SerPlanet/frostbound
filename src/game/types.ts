// Datentypen der Spiellogik (docs/technical/architecture.md, Abschnitt 3).
// Reines TypeScript, kein Phaser, keine Browser-APIs. Positionen in logischen Einheiten (LE).

export type Difficulty = "gemuetlich" | "normal" | "winterhart";

export type GameStatus = "running" | "won" | "lost";

export type PartId = "locomotive" | "wagon";

export type AttackSource = "player" | "turret";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Eingabe pro Schritt als Richtungsvektor, Werte -1, 0 oder 1 (TECH-04). */
export interface PlayerInput {
  x: number;
  y: number;
}

/** Keine Lebenspunkte: Der Spieler kann nicht sterben (D-057). */
export interface Player {
  x: number;
  y: number;
  attackCooldownMs: number;
}

/** Genau ein Gegnertyp (D-038). */
export interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  target: PartId;
}

/**
 * Lokomotive oder Wagon. `destroyed` wird bei 0 HP gesetzt und bleibt bis zum
 * vollständigen Reparaturabschluss bestehen, auch wenn `hp` währenddessen steigt.
 * Intakt bedeutet: `destroyed === false`.
 */
export interface TrainPart {
  id: PartId;
  rect: Rect;
  zone: Rect;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  repairProgressMs: number;
}

/** Das Geschütz sitzt auf dem Wagon und ist nie Gegnerziel. */
export interface Turret {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  attackCooldownMs: number;
}

/** Ein Eintrag des Wellenplans: `count` Gegner erscheinen zum Zeitpunkt `atMs`. */
export interface SpawnEntry {
  atMs: number;
  count: number;
}

export interface Stats {
  spawned: number;
  killsByPlayer: number;
  killsByTurret: number;
  reachedTrain: number;
  damageByPart: Record<PartId, number>;
  repairMsByPart: Record<PartId, number>;
  result: GameStatus;
}

/** Ereignisse eines Schritts, nur Lesezugriff für Darstellung und Statistik (TECH-16). */
export type GameEvent =
  | { type: "enemyDefeated"; enemyId: number; source: AttackSource }
  | { type: "enemyReachedTrain"; enemyId: number; part: PartId }
  | { type: "partDestroyed"; part: PartId }
  | { type: "turretDestroyed" }
  | { type: "partRepaired"; part: PartId }
  | { type: "shot"; source: AttackSource; fromX: number; fromY: number; toX: number; toY: number };

export interface World {
  status: GameStatus;
  difficulty: Difficulty;
  timeMs: number;
  player: Player;
  locomotive: TrainPart;
  wagon: TrainPart;
  turret: Turret;
  enemies: Enemy[];
  /** Wellenplan, nach Zeitpunkt sortiert. */
  spawnPlan: SpawnEntry[];
  /** Index des nächsten noch nicht ausgeführten Plan-Eintrags. */
  nextSpawnIndex: number;
  nextEnemyId: number;
  stats: Stats;
  events: GameEvent[];
  /** Austauschbare Zufallsfunktion, Werte in [0, 1) (TECH-15). Kein Seed-System. */
  random: () => number;
}
