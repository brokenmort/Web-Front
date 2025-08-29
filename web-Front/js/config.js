// Central API base config (ASCII only comments).
// - Default: Heroku (works with your Live Server)
// - If frontend runs on Render, set DEFAULT_RENDER_API to your backend on Render
// - Supports override via query (?api=...) or localStorage (apiBaseOverride)
(function () {
  const DEFAULT_HEROKU = "https://pagina-web-finansas-b6474cfcee14.herokuapp.com";
  const DEFAULT_RENDER_API = "https://<your-backend-render>.onrender.com"; // TODO: set if you have backend on Render

  // Read override from query or localStorage
  const params = new URLSearchParams(window.location.search);
  const queryApi = params.get("api");
  const storedApi = (function(){
    try { return localStorage.getItem("apiBaseOverride"); } catch (_) { return null; }
  })();

  // Normalize URL: trim, add https if missing, drop trailing slash
  const normalize = (u) => {
    if (!u) return null;
    let x = String(u).trim();
    if (!x) return null;
    if (!/^https?:\/\//i.test(x)) x = "https://" + x;
    return x.replace(/\/+$/, "");
  };

  let apiBase = normalize(queryApi) || normalize(storedApi);

  if (!apiBase) {
    const host = window.location.hostname;
    if (host.endsWith("onrender.com")) {
      // Frontend on Render: try your Render backend first, else fallback to Heroku
      const maybeRender = /<your-backend-render>/.test(DEFAULT_RENDER_API) ? null : DEFAULT_RENDER_API;
      apiBase = normalize(maybeRender) || normalize(DEFAULT_HEROKU);
    } else if (host === "localhost" || host === "127.0.0.1") {
      // Local Live Server: keep Heroku by default
      apiBase = normalize(DEFAULT_HEROKU);
    } else {
      // Any other host: fallback to Heroku
      apiBase = normalize(DEFAULT_HEROKU);
    }
  }

  window.API_BASE = apiBase;

  // Helpers to set/clear override at runtime
  window.setApiBase = function (url) {
    try { localStorage.setItem("apiBaseOverride", url); } catch (_) {}
    window.API_BASE = normalize(url);
    console.info("API_BASE override set to:", window.API_BASE);
  };
  window.clearApiBaseOverride = function () {
    try { localStorage.removeItem("apiBaseOverride"); } catch (_) {}
    console.info("API_BASE override cleared. Using:", window.API_BASE);
  };

  console.info("API_BASE:", window.API_BASE);
})();
