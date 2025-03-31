/**
 * 簡単なサンプルサービスワーカー
 * - 指定したファイルをインストール(初回読み込み時)にキャッシュし、
 *   以降はキャッシュ優先で返却する方式 (オフラインでも最低限表示可能)
 */

const CACHE_NAME = 'schedule-app-cache-v1'; 
const urlsToCache = [
  '/',              // ルート
  '/index.html',    // スケジュール表示ページ
  '/add.html',      // 予定追加ページ
  '/styles.css',    // CSS
  '/manifest.json', // マニフェスト
  // アイコン・その他JSファイルなども追加
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  // 古いキャッシュを削除するなどの処理をここで行う場合がある
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Googleフォームやスプレッドシートなど、外部ドメインへのリクエストはキャッシュできない/しにくい
  // ここでは最低限、自己ドメイン配下のリソースをキャッシュから返す例
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返し、なければネットワークから取得
      return response || fetch(event.request);
    })
  );
});
