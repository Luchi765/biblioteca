const CACHE_NAME = 'biblioteca-v1';
const PAGINA_OFFLINE = '/offline';
const ARCHIVOS_A_GUARDAR = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  PAGINA_OFFLINE,
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_A_GUARDAR))
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: activado');
  // Borra cachés de versiones anteriores (por ejemplo, 'biblioteca-v0').
  event.waitUntil(
    caches
      .keys()
      .then((nombres) =>
        Promise.all(
          nombres
            .filter((nombre) => nombre !== CACHE_NAME)
            .map((nombre) => caches.delete(nombre))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {
  // Solo manejamos peticiones GET; el resto (POST, etc.) va directo a la red.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((respuestaEnCache) => {
      if (respuestaEnCache) return respuestaEnCache;

      return fetch(event.request).catch(() => {
        // Desafío A: si falla la red y es una navegación entre páginas,
        // mostramos la página de "Estás sin conexión".
        if (event.request.mode === 'navigate') {
          return caches.match(PAGINA_OFFLINE);
        }
        return Response.error();
      });
    })
  );
});
