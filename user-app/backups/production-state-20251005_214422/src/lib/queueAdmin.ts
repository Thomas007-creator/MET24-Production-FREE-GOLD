import { openDB } from 'idb';

const DB_NAME = 'pwa-offline-queue';
const DB_VERSION = 1;
const STORE_NAME = 'requests';

export type AdminRequest = {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string | null;
  timestamp: number;
  attempts: number;
  nextRetry?: number | null;
};

async function getDB() {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-timestamp', 'timestamp');
      }
    }
  });
}

export async function listQueued(limit = 100) {
  const db = await getDB();
  return await db.getAll(STORE_NAME, undefined as any, limit) as AdminRequest[];
}

export async function removeQueued(id: number) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clearAll() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export default { listQueued, removeQueued, clearAll };
