import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AI_DB extends DBSchema {
  sessions: {
    key: string;
    value: {
      id: string;
      userId: string;
      mbtiType: string;
      createdAt: string;
      updatedAt?: string;
      messages: any[];
      progress?: number;
    };
    indexes: { 'by-user': string };
  };
  recordings: {
    key: string;
    value: {
      id: string;
      sessionId: string;
      blob: Blob;
      createdAt: string;
    };
    indexes: { 'by-session': string };
  };
}

let _db: IDBPDatabase<AI_DB> | null = null;

async function getDb() {
  if (_db) return _db;
  _db = await openDB<AI_DB>('ai-imagination-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('sessions')) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' });
        store.createIndex('by-user', 'userId');
      }
      if (!db.objectStoreNames.contains('recordings')) {
        const store = db.createObjectStore('recordings', { keyPath: 'id' });
        store.createIndex('by-session', 'sessionId');
      }
    }
  });
  return _db;
}

export async function saveSessionToDb(session: AI_DB['sessions']['value']) {
  const db = await getDb();
  await db.put('sessions', session);
}
export async function loadSessionFromDb(userId: string) {
  const db = await getDb();
  const idx = db.transaction('sessions').store.index('by-user');
  const cursor = await idx.openCursor(userId);
  if (!cursor) return null;
  // return latest by createdAt; naive approach: collect all
  const results = await idx.getAll(userId);
  if (!results || results.length === 0) return null;
  // sort by createdAt desc
  results.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  return results[0];
}
export async function listSessionSummaries(userId: string) {
  const db = await getDb();
  const idx = db.transaction('sessions').store.index('by-user');
  const all = await idx.getAll(userId);
  return all.map(s => ({ id: s.id, createdAt: s.createdAt, mbtiType: s.mbtiType }));
}
export async function saveRecordingBlob(sessionId: string, blob: Blob) {
  const db = await getDb();
  const id = `rec_${Date.now()}`;
  await db.put('recordings', { id, sessionId, blob, createdAt: new Date().toISOString() });
  return id;
}
export async function listRecordings(sessionId: string) {
  const db = await getDb();
  const idx = db.transaction('recordings').store.index('by-session');
  const recs = await idx.getAll(sessionId);
  return recs;
}
