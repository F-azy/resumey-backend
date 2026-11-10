import { query } from '../config/db.js';

// `details` and `latex` are legacy columns from the first version; new resumes use `data` (JSONB).
export const createTable = () =>
  query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id                SERIAL PRIMARY KEY,
      user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      template_id       INTEGER REFERENCES templates(id) ON DELETE SET NULL,
      title             VARCHAR(200) NOT NULL,
      details           TEXT,
      job_description   TEXT,
      latex             TEXT,
      data              JSONB,
      profile_image_url TEXT,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE resumes ADD COLUMN IF NOT EXISTS data JSONB;
    ALTER TABLE resumes ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
    ALTER TABLE resumes ALTER COLUMN details DROP NOT NULL;
    ALTER TABLE resumes ALTER COLUMN latex DROP NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
  `);

export const create = async ({ userId, templateId, title, data, jobDescription }) => {
  const { rows } = await query(
    `INSERT INTO resumes (user_id, template_id, title, job_description, data, profile_image_url)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6) RETURNING *`,
    [userId, templateId || null, title, jobDescription || null, JSON.stringify(data), data.personal.photoUrl || null]
  );
  return rows[0];
};

export const findAllByUser = async (userId) => {
  const { rows } = await query(
    `SELECT id, title, template_id, profile_image_url, created_at, updated_at
     FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  );
  return rows;
};

export const findById = async (id, userId) => {
  const { rows } = await query(
    `SELECT r.*, t.slug AS template_slug, t.name AS template_name, t.config AS template_config
     FROM resumes r LEFT JOIN templates t ON t.id = r.template_id
     WHERE r.id = $1 AND r.user_id = $2`,
    [id, userId]
  );
  return rows[0];
};

export const update = async ({ id, userId, title, data }) => {
  const { rows } = await query(
    `UPDATE resumes SET
       title = COALESCE($3, title),
       data = COALESCE($4::jsonb, data),
       profile_image_url = CASE WHEN $4::jsonb IS NULL THEN profile_image_url ELSE $5::text END,
       updated_at = NOW()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId, title || null, data ? JSON.stringify(data) : null, data?.personal?.photoUrl || null]
  );
  return rows[0];
};

export const remove = async (id, userId) => {
  const { rowCount } = await query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount > 0;
};