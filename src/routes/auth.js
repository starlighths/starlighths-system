const express = require('express');
const router = express.Router();
const db = require('../db');
const { comparePassword, hashPassword } = require('../utils/hash');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXP } = require('../middleware/auth');

// POST /auth/login
router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) return res.status(400).json({ error: 'Missing credentials' });
  const { rows } = await db.query('SELECT user_id, password_hash, role, must_change_password FROM users WHERE user_id=$1', [user_id]);
  if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXP });
  res.json({ token, must_change_password: user.must_change_password, role: user.role });
});

// POST /auth/change-password
router.post('/change-password', async (req, res) => {
  const { user_id, old_password, new_password } = req.body;
  if (!user_id || !new_password) return res.status(400).json({ error: 'Missing parameters' });

  const { rows } = await db.query('SELECT password_hash FROM users WHERE user_id=$1', [user_id]);
  if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

  // If old_password provided, verify; otherwise allow (this endpoint may be called post-reset)
  if (old_password) {
    const ok = await comparePassword(old_password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: 'Incorrect old password' });
  }

  const newHash = await hashPassword(new_password);
  await db.query('UPDATE users SET password_hash=$1, must_change_password=false WHERE user_id=$2', [newHash, user_id]);

  res.json({ success: true });
});

module.exports = router;