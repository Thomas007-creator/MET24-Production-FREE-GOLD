const express = require('express');
const router = express.Router();
const db = require('../db/pg');
const fs = require('fs');
const path = require('path');

// Very light admin check for demo: set header x-admin: true
function requireAdmin(req, res, next) {
  if (req.headers['x-admin'] === 'true') return next();
  return res.status(403).json({ error: 'admin required' });
}

// GET /api/dev/mbti/:type/content
router.get('/:type/content', requireAdmin, async (req, res) => {
  const mbti = req.params.type.toUpperCase();
  try {
    const q = `SELECT * FROM mbti_content WHERE mbti_type = $1 ORDER BY kind, order_idx`;
    const r = await db.query(q, [mbti]);
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dev/mbti/:type/upload-texts (admin)
router.post('/:type/upload-texts', requireAdmin, async (req, res) => {
  const mbti = req.params.type.toUpperCase();
  const payload = req.body.items; // expect [{ kind, order_idx, content }]
  if (!Array.isArray(payload)) return res.status(400).json({ error: 'items array required' });

  try {
    const queries = payload.map(it => {
      const q = `
        INSERT INTO mbti_content (mbti_type, kind, order_idx, content, migration_seed, seed_immutable, created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (mbti_type, kind, order_idx) DO UPDATE
        SET content = EXCLUDED.content,
            migration_seed = EXCLUDED.migration_seed,
            seed_immutable = EXCLUDED.seed_immutable,
            updated_at = now()
        WHERE mbti_content.migration_seed = EXCLUDED.migration_seed OR mbti_content.migration_seed IS NULL
      `;
      const vals = [mbti, it.kind, it.order_idx || 0, it.content, 'mbti_v001', true, 'admin'];
      return db.query(q, vals);
    });

    await Promise.all(queries);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/mbti/content/:id (edit route; allows admin to overwrite seed)
router.patch('/content/:id', async (req, res) => {
  const id = req.params.id;
  const isAdmin = req.headers['x-admin'] === 'true';
  const { content, promote_to_seed } = req.body;

  try {
    const r = await db.query('SELECT * FROM mbti_content WHERE id = $1', [id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' });

    const row = r.rows[0];

    if (row.seed_immutable && !isAdmin) {
      // Create a personal override (new row with same mbti_type/kind but unique id and local metadata)
      const insertQ = `INSERT INTO mbti_content (mbti_type, kind, order_idx, content, migration_seed, seed_immutable, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
      const vals = [row.mbti_type, row.kind, row.order_idx, content, null, false, 'user_override'];
      const ins = await db.query(insertQ, vals);
      return res.status(201).json({ override: ins.rows[0] });
    }

    // Admin or non-seeded: update existing
    const updateQ = `UPDATE mbti_content SET content = $1, updated_at = now(), updated_by = $2 WHERE id = $3 RETURNING *`;
    const upd = await db.query(updateQ, [content, isAdmin ? 'admin' : 'user', id]);

    // Optionally promote to seed
    if (promote_to_seed && isAdmin) {
      const seedQ = `UPDATE mbti_content SET migration_seed = $1, seed_immutable = true, updated_at = now() WHERE id = $2`;
      await db.query(seedQ, ['mbti_v001', id]);
    }

    res.json({ updated: upd.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dev/mbti/:type/restore-seed (admin)
router.post('/:type/restore-seed', requireAdmin, async (req, res) => {
  const mbti = req.params.type.toUpperCase();
  try {
    // restore by replacing any non-migration rows with migration source if available
    // For simplicity, we'll delete non-migration overrides for this mbti
    const delQ = `DELETE FROM mbti_content WHERE mbti_type = $1 AND (migration_seed IS NULL OR migration_seed != 'mbti_v001')`;
    await db.query(delQ, [mbti]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
















