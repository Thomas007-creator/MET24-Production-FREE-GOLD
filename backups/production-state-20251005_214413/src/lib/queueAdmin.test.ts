import 'fake-indexeddb/auto';
import queueAdmin from './queueAdmin';

describe('queueAdmin helper', () => {
  test('listQueued returns empty initially and clearAll works', async () => {
    const list = await queueAdmin.listQueued();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);

    // insert via db directly to simulate queued request
    const db = await (await import('idb')).openDB('pwa-offline-queue', 1);
    await db.add('requests', {
      url: '/api/test',
      method: 'POST',
      headers: {},
      body: JSON.stringify({ a: 1 }),
      timestamp: Date.now(),
      attempts: 0
    });

    const list2 = await queueAdmin.listQueued();
    expect(list2.length).toBe(1);

    await queueAdmin.clearAll();
    const list3 = await queueAdmin.listQueued();
    expect(list3.length).toBe(0);
  });
});
