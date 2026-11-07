import fs from 'fs';
import { pool } from './db.js';
import * as User from '../models/user.model.js';
import * as Template from '../models/template.model.js';
import * as Resume from '../models/resume.model.js';

const defaultTemplate = fs.readFileSync(new URL('../templates/resume.tex', import.meta.url), 'utf8');

// Creates tables (order matters because of foreign keys) and seeds the default template.
export async function initDb() {
  await pool.query('SELECT 1');
  await User.createTable();
  await Template.createTable();
  await Resume.createTable();

  if ((await Template.count()) === 0) {
    await Template.create({
      name: 'Classic one page',
      description: 'Sans serif, tight spacing, ruled section headings. A4.',
      latexSource: defaultTemplate,
    });
  }
  console.log('Database ready');
}
