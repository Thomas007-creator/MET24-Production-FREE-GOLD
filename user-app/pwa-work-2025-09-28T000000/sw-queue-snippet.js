// Snippet: paste into your existing `sw.js` to wire IndexedDB queue processing
// This snippet assumes the project uses `idb` (already in dependencies) and the
// `offlineQueue.ts` logic above. In a vanilla service worker you can duplicate
// the minimal logic below or bundle the helper into the SW build.

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync' || event.tag.startsWith('retry-')) {
    event.waitUntil((async () => {
      try {
        // open the same DB as client code and process entries
        // Simple inline implementation using idb (if idb is available in SW)
        const dbOpen = await (self as any).idb.openDB('pwa-offline-queue', 1);
        const tx = dbOpen.transaction('requests', 'readonly');
        const all = await tx.store.getAll();
        for (const item of all) {
          try {
            const init = {
              method: item.method,
              headers: item.headers,
              body: item.body ?? undefined
            };
            const resp = await fetch(item.url, init);
            if (resp.ok) {
              await dbOpen.delete('requests', item.id);
            } else {
              // leave it for retry
            }
          } catch (err) {
            // network error — will retry later
          }
        }
      } catch (err) {
        // If idb is not available in SW bundle, you can implement a tiny
        // IndexedDB helper in the SW, or postMessage the client to trigger
        // a sync when online.
        console.error('Queue processing failed in SW sync event', err);
      }
    })());
  }
});

// Example: when client enqueues via postMessage, you can register a sync tag:
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'ENQUEUE_AND_SYNC') {
    // client already stored the entry in IndexedDB; try to register a sync
    if (self.registration && (self.registration as any).sync) {
      (self.registration as any).sync.register('background-sync').catch(() => {
        // background sync unsupported — you may attempt to fetch immediately
      });
    }
  }
});
