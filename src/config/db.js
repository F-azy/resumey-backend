import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
  ...env.db,
  ssl: {
    rejectUnauthorized: false,
    servername: env.db.host,
  },
});

export const query = (text, params) => pool.query(text, params);