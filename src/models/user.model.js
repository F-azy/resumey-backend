import { query } from '../config/db.js';

export const createTable = () =>
  query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(120) NOT NULL,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

export const create = async ({ name, email, passwordHash }) => {
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );
  return rows[0];
};

export const findByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

export const findById = async (id) => {
  const { rows } = await query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
  return rows[0];
};
