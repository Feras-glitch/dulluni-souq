/* عامل الخدمة لكتاب «دلوني على السوق».
 * يحفظ الملفات كلها عند التثبيت، ويخدمها من الذاكرة دون اتصال.
 * رقم الإصدار يُولَّد آليًا عند البناء من محتوى الملفات، فأي تعديل في الكتاب يُنتج عاملًا جديدًا
 * يحذف النسخة القديمة. لا يتعامل مع تسجيلات الأطفال؛ فهي في IndexedDB ولا تمرّ بالشبكة. */
'use strict';
const VERSION = '1838523f3d99';
const CACHE = 'dulluni-souq-' + VERSION;
const ASSETS = ["./", "index.html", "manifest.json", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('dulluni-souq-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  /* فتح الصفحة: من الذاكرة دائمًا (الملف كله صفحة واحدة) */
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE).then(c => c.match('index.html')).then(r => r || fetch(req))
    );
    return;
  }
  /* بقية الملفات: من الذاكرة أولًا، ثم الشبكة */
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req))
  );
});
