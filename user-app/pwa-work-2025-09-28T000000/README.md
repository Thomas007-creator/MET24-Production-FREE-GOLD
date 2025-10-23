Offline queue prototype

What this folder contains
- `offlineQueue.ts` — TypeScript helper that stores serializable requests into IndexedDB (uses `idb`).
- `sw-queue-snippet.js` — A short service-worker snippet showing how to process the queue in a `sync` event.
- `offlineQueue.test.ts` — Test skeleton (requires `fake-indexeddb` to run in Node).

How to use (client-side)
1. Import the helper in client code (e.g. when a network request fails):

```ts
import OfflineQueue from '../pwa-work-2025-09-28T000000/offlineQueue';

// Example: if fetch fails, enqueue
await OfflineQueue.enqueue({
  url: '/api/diary',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Offline entry' })
});

// Ask service worker to register a sync
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  const reg = await navigator.serviceWorker.ready;
  try { await reg.sync.register('background-sync'); } catch (e) { /* fallback */ }
}
```

How to use (inside service worker)
- Either bundle `offlineQueue.ts` logic into your `sw.js` build (recommended), or
  duplicate the minimal processing logic from `sw-queue-snippet.js` there.
- On `sync` event, iterate queued requests and attempt `fetch`. Remove successful items.

Running tests (optional)
- The test file uses IndexedDB and therefore needs a Node IndexedDB polyfill. Install dev dependency:

```bash
npm install --save-dev fake-indexeddb
```

- Then run jest (project already configures jest):

```bash
npm run test:unit
```

Notes & next steps
- Consider adding exponential backoff and max-attempts logic to `processQueue`.
- Add an admin endpoint or UI to inspect queued requests for debugging.
- For compatibility: iOS Safari does not support background sync or Push — provide in-app fallbacks.
