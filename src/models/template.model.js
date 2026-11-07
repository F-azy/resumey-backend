import { query } from '../config/db.js';

export const createTable = () =>
  query(`
    CREATE TABLE IF NOT EXISTS templates (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(120) NOT NULL,
      description  TEXT,
      latex_source TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

export const count = async () => {
  const { rows } = await query('SELECT COUNT(*)::int AS n FROM templates');
  return rows[0].n;
};

export const create = async ({ name, description, latexSource }) => {
  const { rows } = await query(
    `INSERT INTO templates (name, description, latex_source)
     VALUES ($1, $2, $3) RETURNING id, name, description, created_at`,
    [name, description, latexSource]
  );
  return rows[0];
};

export const findAll = async () => {
  const { rows } = await query('SELECT id, name, description, created_at FROM templates ORDER BY id');
  return rows;
};

export const findById = async (id) => {
  const { rows } = await query('SELECT * FROM templates WHERE id = $1', [id]);
  return rows[0];
};

export const findFirst = async () => {
  const { rows } = await query('SELECT * FROM templates ORDER BY id LIMIT 1');
  return rows[0];
};
