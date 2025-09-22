'use strict';
require('dotenv').config();

/**
 * PUBLIC_INTERFACE
 * getConfig
 * Provide centralized application configuration loaded from environment variables.
 */
function getConfig() {
  /** This function returns the runtime configuration for the app. */
  const env = process.env;

  const cfg = {
    nodeEnv: env.NODE_ENV || 'development',
    host: env.HOST || '0.0.0.0',
    // Default to 3001 to match container readiness expectations
    port: Number(env.PORT || 3001),

    // Allow 'none' to run without a DB; avoids crashes when env vars are missing
    dbClient: (env.DB_CLIENT || 'none').toLowerCase(),

    mongo: {
      uri: env.MONGO_URI,
      dbName: env.MONGO_DB_NAME,
      notesCollection: env.MONGO_NOTES_COLLECTION || 'notes',
    },

    sql: {
      uri: env.SQL_URI,
      notesTable: env.SQL_NOTES_TABLE || 'notes',
    },
  };

  return cfg;
}

module.exports = {
  getConfig,
};
