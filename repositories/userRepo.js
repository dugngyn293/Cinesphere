// User repository using MySQL connection pool (CommonJS)
// NOTE: Keep this implementation minimal so the demo can create & retrieve users.

const { pool } = require('../database/pool');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// BASIC CRUD HELPERS


async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findByGoogleId(googleId) {
  const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
  return rows[0];
}

async function create({ username, email, password, google_id, profile_image_url }) {
  // When password is undefined (OAuth users) we store NULL
  const hashed = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

  // Ensure we always have a non-null password value (OAuth users)
  const finalPassword = hashed || await bcrypt.hash(require('crypto').randomBytes(8).toString('hex'), SALT_ROUNDS);

  const [result] = await pool.query(
    `INSERT INTO users (username, email, password, google_id, profile_image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [username, email, finalPassword, google_id || null, profile_image_url || null]
  );

  return { id: result.insertId, username, email, google_id, profile_image_url };
}

// Utility for validating a login attempt
async function verifyPassword(email, candidatePassword) {
  const user = await findByEmail(email);
  if (!user || !user.password) return null;
  const ok = await bcrypt.compare(candidatePassword, user.password);
  return ok ? user : null;
}

module.exports = {
  findById,
  findByEmail,
  findByGoogleId,
  create,
  verifyPassword,
};

