-- SQL Schema extensions for the timetable engine
CREATE TABLE timetable (
  id SERIAL PRIMARY KEY,
  class_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);
-- Add other table definitions here.