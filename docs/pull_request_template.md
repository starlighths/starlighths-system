### Summary:
Adds core DB schema and a Node/Express auth layer implementing JWT login, bcrypt password hashing, an admin reset-password endpoint, CSV bulk-import endpoints for teachers and students, and admin audit logging.

### Files added:
- package.json
- sql/schema.sql (users, students, s_classes, admin_audit_log)
- src/db.js
- src/utils/hash.js
- src/middleware/auth.js
- src/routes/auth.js
- src/routes/admin.js
- src/server.js

### Migration:
Run: `psql $DATABASE_URL -f sql/schema.sql`

### Env:
- DATABASE_URL (Postgres connection)
- JWT_SECRET (production secret)

### Acceptance checklist:
- [ ] Admin can bulk-import teachers and students via /admin/import endpoints
- [ ] A user logging in with a temporary password receives must_change_password=true
- [ ] Admin can reset a user’s password via /admin/reset-password and the action is logged to admin_audit_log
- [ ] Students are linked to their primary/secondary teacher in students table

### How to test locally:
1. Set DATABASE_URL and JWT_SECRET env vars.
2. npm install
3. psql $DATABASE_URL -f sql/schema.sql
4. Create an initial admin user (generate bcrypt hash locally and insert into users table).
5. npm start
6. Use Postman/cURL to hit:
   - POST /auth/login { user_id, password }
   - POST /auth/change-password { user_id, old_password?, new_password }
   - (Admin) POST /admin/reset-password { target_user_id, temp_password }
   - (Admin) POST /admin/import/students (multipart form file: 'file')

### Notes:
- The must_change_password flag is returned on login so clients can enforce password-change flows.
- CSV import expects columns described in the admin routes (user_id,email,display_name,password, etc).