const app = require('./app');
const { initDb, getDb } = require('./db');
const Logger = require('./config/logger');
const { getConfig } = require('./config');

const { port, host } = getConfig();

let server;

async function start() {
  try {
    await initDb();
    server = app.listen(port, host, () => {
      Logger.info('Server started', { url: `http://${host}:${port}` });
    });
  } catch (err) {
    Logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

start();

// Graceful shutdown
async function shutdown(signal) {
  Logger.warn('Shutdown signal received', { signal });
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    try {
      const db = getDb();
      await db.close?.();
    } catch (_) {
      // ignore if not initialized
    }
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
