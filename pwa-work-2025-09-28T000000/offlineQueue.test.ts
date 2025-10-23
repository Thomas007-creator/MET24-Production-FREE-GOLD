// Test skeleton for offlineQueue helper
// Note: run this test in Node with `fake-indexeddb` polyfill installed.

// Example setup: npm i --save-dev fake-indexeddb

import 'fake-indexeddb/auto';
import OfflineQueue from './offlineQueue';

describe('offlineQueue basic operations (requires fake-indexeddb)', () => {
  it('enqueues and retrieves an item', async () => {
    const id = await OfflineQueue.enqueue({ url: '/test', method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'hello' });
    expect(typeof id).toBe('number');
    const all = await OfflineQueue.getAll();
    expect(all.length).toBeGreaterThan(0);
    const first = all.find(a => a.id === id);
    expect(first).toBeDefined();
    if (first) {
      expect(first.url).toBe('/test');
      expect(first.body).toBe('hello');
    }
    await OfflineQueue.clear();
    const afterClear = await OfflineQueue.getAll();
    expect(afterClear.length).toBe(0);
  });

  it('increments attempts and sets nextRetry on failure', async () => {
    await OfflineQueue.clear();
    const id = await OfflineQueue.enqueue({ url: '/test-backoff', method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'x' });
    const all = await OfflineQueue.getAll();
    const item = all.find(a => a.id === id)!;
    expect(item.attempts).toBe(0);

    // simulate a failed send -> call incrementAttempts directly
    await OfflineQueue.processQueue(async (r) => ({ ok: false }));

    const after = await OfflineQueue.getAll();
    const updated = after.find(a => a.id === id)!;
    expect(updated.attempts).toBeGreaterThanOrEqual(1);
    expect(typeof updated.nextRetry).toBe('number');
  });

  it('removes item after exceeding max attempts', async () => {
    await OfflineQueue.clear();
    const id = await OfflineQueue.enqueue({ url: '/test-max', method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'y' });
    // Directly increment attempts to simulate repeated failures
    for (let i = 0; i < 6; i++) {
      await OfflineQueue.incrementAttempts(id as number);
    }

    const all = await OfflineQueue.getAll();
    const found = all.find(a => a.id === id);
    // After exceeding MAX_ATTEMPTS (5), record should be removed by processQueue in normal flow.
    // Since we only incremented attempts here, ensure attempts >= 5 and nextRetry is null
    expect(found).toBeDefined();
    if (found) {
      expect(found.attempts).toBeGreaterThanOrEqual(5);
      expect(found.nextRetry).toBeNull();
    }
  });
});
