/** Runs before the app entry, so a failed entry import cannot bypass recovery. */
function installModuleRecovery() {
  const key = "aurateori-module-recovery";
  let recovering = false;
  function recover(value: unknown) {
    const message = value instanceof Error ? value.message : String(value ?? "");
    if (!/Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Loading chunk .+ failed/i.test(message)) return;
    if (recovering || !navigator.onLine) return;
    const now = Date.now();
    try {
      const last = Number(sessionStorage.getItem(key));
      if (last && now - last < 60000) return;
      sessionStorage.setItem(key, String(now));
    } catch {
      return; // No persistent guard means a reload loop cannot be ruled out.
    }
    recovering = true;
    window.setTimeout(() => window.location.reload(), 1000);
  }
  window.addEventListener("unhandledrejection", (event) => recover(event.reason));
  window.addEventListener("error", (event) => recover(event.message));
  window.addEventListener("vite:preloadError", (event) => {
    const payload = (event as Event & { payload?: unknown }).payload;
    recover(payload);
  });
}

export const MODULE_RECOVERY_SCRIPT = `(${installModuleRecovery.toString()})();`;