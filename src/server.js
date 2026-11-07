import app from './app.js';
import { env } from './config/env.js';
import { initDb } from './config/initDb.js';

async function start() {
  try {
    await initDb();
    app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

start();
