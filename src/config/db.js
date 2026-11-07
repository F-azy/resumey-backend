import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
  ...env.db,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = (text, params) => pool.query(text, params);