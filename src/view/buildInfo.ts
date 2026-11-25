// Kennzeichnung von Testversionen (D-063, TECH-23). Reines DOM-Overlay, unabhängig von Phaser und Gameplay.
// Die Werte kommen aus dem Build (Umgebungsvariablen VITE_BUILD_KIND, VITE_BUILD_BRANCH, VITE_BUILD_COMMIT).
// Nur bei VITE_BUILD_KIND=preview wird ein Hinweis gezeigt. Der akzeptierte Stand (main) und lokale Starts bleiben unverändert.

export function showBuildInfo(): void {
  if (import.meta.env.VITE_BUILD_KIND !== "preview") return;

  const branch = String(import.meta.env.VITE_BUILD_BRANCH ?? "unbekannt");
  const commit = String(import.meta.env.VITE_BUILD_COMMIT ?? "unbekannt");

  const label = document.createElement("div");
  label.id = "build-info";
  label.textContent = `TESTVERSION · Branch: ${branch} · Commit: ${commit}`;
  label.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "z-index:10000",
    "padding:4px 10px",
    "background:#ffb300",
    "color:#1a1200",
    "font:bold 13px Consolas,monospace",
    "pointer-events:none",
    "border-bottom-right-radius:6px",
  ].join(";");
  document.body.appendChild(label);
}
