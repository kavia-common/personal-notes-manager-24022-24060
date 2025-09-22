'use strict';

const { getConfig } = require('../config');
const Logger = require('../config/logger');

let client = null;

/**
 * PUBLIC_INTERFACE
 * initDb
 * Initialize the database connection based on configuration.
 */
async function initDb() {
  /** This function connects to the configured database and returns a provider API. */
  const cfg = getConfig();

  if (client) {
    return client;
  }

  if (cfg.dbClient === 'mongo') {
    const mongo = require('./mongoClient');
    client = await mongo.connect();
    Logger.info('MongoDB connected', { db: cfg.mongo.dbName });
    return client;
  }

  if (cfg.dbClient === 'sql') {
    const sql = require('./sqlClient');
    client = await sql.connect();
    Logger.info('SQL connected', {});
    return client;
  }

  throw new Error(`Unsupported DB_CLIENT: ${cfg.dbClient}`);
}

/**
 * PUBLIC_INTERFACE
 * getDb
 * Retrieve initialized DB provider.
 */
function getDb() {
  /** This function returns the previously initialized DB provider. */
  if (!client) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return client;
}

module.exports = {
  initDb,
  getDb,
};
