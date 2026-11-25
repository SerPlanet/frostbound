// Tastatureingabe (TECH-04): liefert pro Aufruf einen Richtungsvektor mit Werten -1, 0, 1.
// WASD und Pfeiltasten wirken gleichwertig. Gegenläufige Tasten heben sich auf.
// Keine Spielregeln: Die Normierung der Diagonale geschieht in game/player.ts.

import Phaser from "phaser";
import type { PlayerInput } from "../game/types.ts";

type KeyMap = Record<"w" | "a" | "s" | "d" | "up" | "left" | "down" | "right", Phaser.Input.Keyboard.Key>;

export function createKeyboardInput(scene: Phaser.Scene): () => PlayerInput {
  const keyboard = scene.input.keyboard;
  if (!keyboard) return () => ({ x: 0, y: 0 });

  keyboard.addCapture("UP,DOWN,LEFT,RIGHT");
  const k = keyboard.addKeys({
    w: "W",
    a: "A",
    s: "S",
    d: "D",
    up: "UP",
    left: "LEFT",
    down: "DOWN",
    right: "RIGHT",
  }) as KeyMap;

  return () => {
    const left = k.a.isDown || k.left.isDown ? 1 : 0;
    const right = k.d.isDown || k.right.isDown ? 1 : 0;
    const up = k.w.isDown || k.up.isDown ? 1 : 0;
    const down = k.s.isDown || k.down.isDown ? 1 : 0;
    return { x: right - left, y: down - up };
  };
}
