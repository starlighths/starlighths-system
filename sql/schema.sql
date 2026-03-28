-- Database schema for Starlight High (minimal initial model)

-- Users: Students, Teachers, Admins
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- custom string e.g., S-25-001 or T-25-001
  email TEXT UNIQUE,
  display_name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','teacher','student')),
  must_change_password BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Students table (linked to users)
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  s_class_id TEXT, -- e.g., "1C"
  primary_teacher_id TEXT, -- teacher user_id
  secondary_teacher_id TEXT, -- teacher user_id
  FOREIGN KEY (primary_teacher_id) REFERENCES users(user_id),
  FOREIGN KEY (secondary_teacher_id) REFERENCES users(user_id)
);

-- S-Classes (class groups)
CREATE TABLE s_classes (
  id SERIAL PRIMARY KEY,
  class_id TEXT UNIQUE NOT NULL, -- e.g., "1C"
  name TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin audit log
CREATE TABLE admin_audit_log (
  id SERIAL PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_user_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (admin_user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_students_user_id ON students(user_id);
