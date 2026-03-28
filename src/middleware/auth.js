const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXP = '2h';

async function authenticateToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // optionally refresh user info from DB
    const { rows } = await db.query('SELECT user_id, role, must_change_password FROM users WHERE user_id=$1', [payload.user_id]);
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch(err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole, JWT_SECRET, JWT_EXP };