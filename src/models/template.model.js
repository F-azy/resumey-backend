import { query } from '../config/db.js';

// `latex_source` is a legacy column; templates are now defined by `config` (see utils/templateConfig.js).
export const createTable = () =>
  query(`
    CREATE TABLE IF NOT EXISTS templates (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(120) NOT NULL,
      description  TEXT,
      latex_source TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE templates ADD COLUMN IF NOT EXISTS slug VARCHAR(60);
    ALTER TABLE templates ADD COLUMN IF NOT EXISTS category VARCHAR(30) NOT NULL DEFAULT 'student';
    ALTER TABLE templates ADD COLUMN IF NOT EXISTS config JSONB;
    ALTER TABLE templates ADD COLUMN IF NOT EXISTS preview_image_url TEXT;
    ALTER TABLE templates ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE templates ALTER COLUMN latex_source DROP NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
  `);

// The template created by the first version becomes the B.Tech template, so existing resumes keep their link.
export const adoptLegacy = () =>
  query(`
    UPDATE templates SET slug = 'btech'
    WHERE slug IS NULL AND name = 'Classic one page'
      AND NOT EXISTS (SELECT 1 FROM templates WHERE slug = 'btech')
  `);

export const upsertSeed = (t) =>
  query(
    `INSERT INTO templates (slug, name, description, category, config, preview_image_url, sort_order)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name, description = EXCLUDED.description, category = EXCLUDED.category,
       config = EXCLUDED.config, preview_image_url = EXCLUDED.preview_image_url, sort_order = EXCLUDED.sort_order`,
    [t.slug, t.name, t.description, t.category, JSON.stringify(t.config), t.previewImageUrl, t.sortOrder]
  );

export const findAll = async () => {
  const { rows } = await query(
    `SELECT id, slug, name, description, category, config, preview_image_url
     FROM templates WHERE config IS NOT NULL ORDER BY sort_order, id`
  );
  return rows;
};

export const findById = async (id) => {
  const { rows } = await query('SELECT id, slug, name, config FROM templates WHERE id = $1', [id]);
  return rows[0];
};

export const findFirst = async () => {
  const { rows } = await query('SELECT id, slug, name, config FROM templates WHERE config IS NOT NULL ORDER BY sort_order, id LIMIT 1');
  return rows[0];
};