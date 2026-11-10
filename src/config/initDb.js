import { pool } from './db.js';
import * as User from '../models/user.model.js';
import * as Template from '../models/template.model.js';
import * as Resume from '../models/resume.model.js';
import { templateSeeds } from './templateSeeds.js';

// Creates tables (order matters because of foreign keys) and keeps the built-in templates up to date.
export async function initDb() {
  await pool.query('SELECT 1');
  await User.createTable();
  await Template.createTable();
  await Template.adoptLegacy();
  for (const seed of templateSeeds) await Template.upsertSeed(seed);
  await Resume.createTable();
  console.log('Database ready');
}