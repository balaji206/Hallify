const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to Supabase"))
  .catch(err => console.error("❌ Error connecting to Supabase:", err));

module.exports = pool;