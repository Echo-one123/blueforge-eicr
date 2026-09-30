// BlueForge Certificates – offline cache. Bump CACHE on every release so devices pick up the new version.
const CACHE = "bf-eicr-v17";
const SHELL = ["./", "./index.html", "./app.js", "./bf-data.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
const OPTIONAL = ["./logo-blueforge.png", "./logo-inaec.png", "./logo-mark.png"];   // cached if present; a missing logo never blocks the update
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: "reload"})))
    .then(() => Promise.all(OPTIONAL.map(u => fetch(new Request(u, {cache: "reload"})).then(r => r.ok ? c.put(u, r) : null).catch(() => null))))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only handle our own files and Google Fonts; everything else (e.g. the sync script) goes straight to the network.
  const own = url.origin === self.location.origin;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!own && !font) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(req, {ignoreSearch: true}) || (req.mode === "navigate" ? await cache.match("./index.html") : undefined);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque") && font) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return hit || Response.error();
    }
  }));
});
