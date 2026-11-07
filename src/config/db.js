import pg from 'pg';
import { env } from './env.js';

// SSL is only enabled when DB_SSL=true (needed for Render's EXTERNAL database URL).
// Do not set `servername`: Node sends the correct SNI from the host in the URL.
const ssl = env.dbSsl ? { rejectUnauthorized: false } : false;

export const pool = new pg.Pool(
  env.databaseUrl ? { connectionString: env.databaseUrl, ssl } : { ...env.db, ssl }
);

export const query = (text, params) => pool.query(text, params);