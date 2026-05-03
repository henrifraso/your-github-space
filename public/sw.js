const ORIGIN = self.location.origin;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Deixa passar: recursos locais, data:, blob:, não-http
  if (
    url.startsWith(ORIGIN) ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    !/^https?:\/\//i.test(url)
  ) return;

  // Roteia todos os requests externos pelo proxy
  event.respondWith(
    fetch(
      `${ORIGIN}/api/proxy?url=${encodeURIComponent(url)}`,
      { credentials: 'omit', method: 'GET' }
    ).catch(() => new Response('', { status: 200 }))
  );
});
