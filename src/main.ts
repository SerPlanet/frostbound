// Einstiegspunkt: wählt den Modus aus der URL (TECH-13).
//   ohne Parameter   normales Spiel (Start, Spielwelt, Ergebnis)
//   ?mode=visuals    statischer Visuals-Test
//   ?mode=selftest   Selbsttest der Spiellogik im Browser (ohne Phaser)
// Die logische Spielfeldgröße 1280 x 720 (16:9) entspricht TECH-01 in docs/technical/architecture.md.

const mode = new URLSearchParams(window.location.search).get("mode");

async function showSelfTest(): Promise<void> {
  // Verwendet dieselbe Prüfdatei wie der Node-Aufruf, keine zweite Implementierung.
  const { runSelfTest } = await import("./tests/selftest.ts");
  const lines: string[] = [];
  const result = runSelfTest((line) => lines.push(line));

  document.body.style.overflow = "auto";
  const root = document.getElementById("game");
  if (!root) return;
  root.style.cssText = "height:auto;padding:24px;color:#e6f3ff;font-family:Consolas,monospace;font-size:15px;";
  const heading = document.createElement("h2");
  heading.textContent = `FROSTBOUND Selbsttest: ${result.failed === 0 ? "PASS" : "FAIL"}`;
  heading.style.color = result.failed === 0 ? "#7ee08f" : "#ff7a7a";
  root.appendChild(heading);
  for (const line of lines) {
    const row = document.createElement("div");
    row.style.whiteSpace = "pre";
    row.textContent = line;
    if (line.startsWith("PASS")) row.style.color = "#7ee08f";
    if (line.startsWith("FAIL")) row.style.color = "#ff7a7a";
    root.appendChild(row);
  }
}

async function startGame(): Promise<void> {
  const Phaser = (await import("phaser")).default;
  const [{ StartScene }, { GameScene }, { ResultScene }, { VisualsScene }] = await Promise.all([
    import("./scenes/StartScene.ts"),
    import("./scenes/GameScene.ts"),
    import("./scenes/ResultScene.ts"),
    import("./scenes/VisualsScene.ts"),
  ]);

  // Die erste Szene der Liste startet automatisch.
  const scenes =
    mode === "visuals"
      ? [VisualsScene, StartScene, GameScene, ResultScene]
      : [StartScene, GameScene, ResultScene, VisualsScene];

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
    scene: scenes,
  });
}

if (mode === "selftest") {
  void showSelfTest();
} else {
  void startGame();
}
