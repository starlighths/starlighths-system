-- ECA Tables creation

CREATE TABLE eca_activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id TEXT,
  category TEXT,
  max_capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE eca_schedules (
  id SERIAL PRIMARY KEY,
  activity_id INT REFERENCES eca_activities(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 5),
  period_num INTEGER DEFAULT 10, -- Period 10: 16:15–17:00
  room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(activity_id, day_of_week, period_num)
);

CREATE TABLE eca_enrollments (
  id SERIAL PRIMARY KEY,
  activity_id INT REFERENCES eca_activities(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active', -- active, paused, dropped
  points INTEGER DEFAULT 0,
  UNIQUE(activity_id, student_id)
);

CREATE TABLE eca_attendance (
  id SERIAL PRIMARY KEY,
  enrollment_id INT REFERENCES eca_enrollments(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  is_present BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(enrollment_id, attendance_date)
);

CREATE TABLE eca_badges (
  id SERIAL PRIMARY KEY,
  badge_name TEXT UNIQUE NOT NULL,
  description TEXT,
  points_threshold INTEGER,
  icon_url TEXT
);

CREATE TABLE student_badges (
  id SERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  badge_id INT REFERENCES eca_badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

CREATE INDEX idx_eca_activities_teacher ON eca_activities(teacher_id);
CREATE INDEX idx_eca_enrollments_student ON eca_enrollments(student_id);
