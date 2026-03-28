const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const parse = require('csv-parse');
const { hashPassword } = require('../utils/hash');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticateToken);
router.use(requireRole('admin'));

// POST /admin/reset-password
// body: { target_user_id: string, temp_password: string }
router.post('/reset-password', async (req, res) => {
  const { target_user_id, temp_password } = req.body;
  if (!target_user_id || !temp_password) return res.status(400).json({ error: 'Missing parameters' });
  const hashed = await hashPassword(temp_password);
  await db.query('UPDATE users SET password_hash=$1, must_change_password=true WHERE user_id=$2', [hashed, target_user_id]);

  // Log to admin audit log
  await db.query('INSERT INTO admin_audit_log (admin_user_id, action, target_user_id, details) VALUES ($1,$2,$3,$4)', [req.user.user_id, 'reset-password', target_user_id, JSON.stringify({ temp_password_set: true })]);

  res.json({ success: true });
});

// CSV bulk imports (teachers / students)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/import/teachers', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Missing file' });
  parse(req.file.buffer.toString(), { columns: true, trim: true }, async (err, records) => {
    if (err) return res.status(400).json({ error: 'CSV parse error' });
    for (const row of records) {
      // row must include user_id,email,display_name and optionally password
      const userId = row.user_id;
      const email = row.email;
      const displayName = row.display_name || row.name || '';
      const rawPassword = row.password || 'TempPass123!';
      const hashed = await hashPassword(rawPassword);
      await db.query('INSERT INTO users (user_id, email, display_name, password_hash, role, must_change_password) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (user_id) DO NOTHING', [userId, email, displayName, hashed, 'teacher', true]);
      await db.query('INSERT INTO admin_audit_log (admin_user_id, action, target_user_id, details) VALUES ($1,$2,$3,$4)', [req.user.user_id, 'import-teacher', userId, JSON.stringify(row)]);
    }
    res.json({ success: true, imported: records.length });
  });
});

router.post('/import/students', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Missing file' });
  parse(req.file.buffer.toString(), { columns: true, trim: true }, async (err, records) => {
    if (err) return res.status(400).json({ error: 'CSV parse error' });
    for (const row of records) {
      // expected columns: user_id,s_class_id,primary_teacher_id,secondary_teacher_id,email,display_name,password
      const userId = row.user_id;
      const email = row.email;
      const displayName = row.display_name || '';
      const rawPassword = row.password || 'TempPass123!';
      const hashed = await hashPassword(rawPassword);
      await db.query('INSERT INTO users (user_id, email, display_name, password_hash, role, must_change_password) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (user_id) DO NOTHING', [userId, email, displayName, hashed, 'student', true]);
      await db.query('INSERT INTO students (user_id, s_class_id, primary_teacher_id, secondary_teacher_id) VALUES ($1,$2,$3,$4) ON CONFLICT (user_id) DO NOTHING', [userId, row.s_class_id, row.primary_teacher_id, row.secondary_teacher_id]);
      await db.query('INSERT INTO admin_audit_log (admin_user_id, action, target_user_id, details) VALUES ($1,$2,$3,$4)', [req.user.user_id, 'import-student', userId, JSON.stringify(row)]);
    }
    res.json({ success: true, imported: records.length });
  });
});

module.exports = router;