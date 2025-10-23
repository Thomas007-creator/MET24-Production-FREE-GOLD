const express = require('express');
const router = express.Router();
const db = require('../db/pg');

// GET /api/preload/mbti
router.get('/mbti', async (req, res) => {
  try {
    const q = `SELECT id, mbti_type, kind, order_idx, content, migration_seed, seed_immutable FROM mbti_content ORDER BY mbti_type, kind, order_idx`;
    const r = await db.query(q);
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
















