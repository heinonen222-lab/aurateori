/**
 * Runs before the app entry, so a failed entry import cannot bypass recovery.
 *
 * The source is a static string on purpose. Deriving it from
 * `installModuleRecovery.toString()` gives different minified output in the
 * server and client bundles, which React reports as a hydration mismatch on
 * every page load.
 */
export const MODULE_RECOVERY_SCRIPT = `(function installModuleRecovery() {
  const key = "aurateori-module-recovery";
  let recovering = false;
  function recover(value) {
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
    window.setTimeout(function () {
      window.location.reload();
    }, 1000);
  }
  window.addEventListener("unhandledrejection", function (event) {
    recover(event.reason);
  });
  window.addEventListener("error", function (event) {
    recover(event.message);
  });
  window.addEventListener("vite:preloadError", function (event) {
    recover(event && event.payload);
  });
})();`;
