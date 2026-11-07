import { query } from '../config/db.js';

export const createTable = () =>
  query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      template_id     INTEGER REFERENCES templates(id) ON DELETE SET NULL,
      title           VARCHAR(200) NOT NULL,
      details         TEXT NOT NULL,
      job_description TEXT,
      latex           TEXT NOT NULL,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
  `);

export const create = async ({ userId, templateId, title, details, jobDescription, latex }) => {
  const { rows } = await query(
    `INSERT INTO resumes (user_id, template_id, title, details, job_description, latex)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, templateId, title, details, jobDescription || null, latex]
  );
  return rows[0];
};

export const findAllByUser = async (userId) => {
  const { rows } = await query(
    `SELECT id, title, template_id, created_at, updated_at
     FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  );
  return rows;
};

export const findById = async (id, userId) => {
  const { rows } = await query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [id, userId]);
  return rows[0];
};

export const updateLatex = async (id, userId, latex) => {
  const { rows } = await query(
    `UPDATE resumes SET latex = $3, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId, latex]
  );
  return rows[0];
};

export const remove = async (id, userId) => {
  const { rowCount } = await query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount > 0;
};
