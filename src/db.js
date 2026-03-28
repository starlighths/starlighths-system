const { Pool } = require('pg');

const pool = new Pool({
  // configure via env vars: PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};