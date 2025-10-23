const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/pg');
// Queue removed - using mock implementation
const enqueueTranscode = async (job) => {
  console.log('Mock transcode job:', job);
  return { id: 'mock-job-id' };
};

const storageDir = path.join(__dirname, '..', 'storage');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

const upload = multer({ dest: storageDir });

// POST /api/uploads/video?mbti=INTJ
router.post('/video', upload.single('file'), async (req, res) => {
  try {
    const mbti = (req.query.mbti || 'GEN').toUpperCase();
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'file required' });

    const storagePath = `mbti/${mbti}/videos/${file.filename}_${file.originalname}`;
    // move file to storagePath
    const destPath = path.join(storageDir, storagePath.replace(/\//g, path.sep));
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.renameSync(file.path, destPath);

    // Insert media_files row
    const insertQ = `INSERT INTO media_files (storage_path, url, mime, size, migration_seed, status, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const vals = [storagePath, null, file.mimetype, file.size, null, 'uploaded', 'uploader'];
    const r = await db.query(insertQ, vals);
    const media = r.rows[0];

    // Enqueue transcode job
    await enqueueTranscode({ media_id: media.id, storage_path: destPath, original_name: file.originalname });

    res.json({ media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
















