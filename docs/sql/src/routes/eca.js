const express = require('express');
const router = express.Router();
const db = require('../db'); // assumes the repo has a db module exporting query()
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create an activity
router.post('/activities', authenticateToken, requireRole('teacher'), async (req, res) => {
  const { title, description, teacher_id, category, max_capacity } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO eca_activities (title, description, teacher_id, category, max_capacity)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, description, teacher_id, category, max_capacity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all activities
router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM eca_activities ORDER BY title`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll a student
router.post('/enroll', authenticateToken, requireRole('teacher'), async (req, res) => {
  const { activity_id, student_id } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO eca_enrollments (activity_id, student_id)
       VALUES ($1,$2) RETURNING *`,
      [activity_id, student_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Already enrolled' });
    res.status(500).json({ error: err.message });
  }
});

// Record attendance
router.post('/attendance', authenticateToken, requireRole('teacher'), async (req, res) => {
  const { enrollment_id, attendance_date, is_present, points_earned } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO eca_attendance (enrollment_id, attendance_date, is_present, points_earned)
       VALUES ($1,$2,$3,$4) ON CONFLICT (enrollment_id, attendance_date)
       DO UPDATE SET is_present = EXCLUDED.is_present, points_earned = EXCLUDED.points_earned
       RETURNING *`,
      [enrollment_id, attendance_date, is_present, points_earned]
    );
    // Optionally update enrollment points
    if (points_earned && is_present) {
      await db.query(`UPDATE eca_enrollments SET points = points + $1 WHERE id = $2`, [points_earned, enrollment_id]);
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Award a badge to a student
router.post('/badges/award', authenticateToken, requireRole('teacher'), async (req, res) => {
  const { student_id, badge_id } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2) RETURNING *`,
      [student_id, badge_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Badge already awarded' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
