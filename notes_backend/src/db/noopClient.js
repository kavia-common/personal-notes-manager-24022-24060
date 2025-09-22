'use strict';

/**
 * PUBLIC_INTERFACE
 * connect
 * Provide a no-op DB client that allows the server to start without a database.
 * This client always reports not healthy and throws for CRUD operations.
 */
async function connect() {
  /** This function returns a provider with the same shape as other DB clients. */
  const notReady = async () => false;
  const unsupported = async () => {
    const err = new Error('Database is not configured. Set DB_CLIENT and connection variables.');
    err.statusCode = 503;
    throw err;
  };

  return {
    type: 'none',
    close: async () => {},
    isHealthy: notReady,
    // CRUD operations throw to clearly indicate DB is not configured
    notes: {
      create: unsupported,
      findById: unsupported,
      findAllByUser: unsupported,
      update: unsupported,
      remove: unsupported,
    },
  };
}

module.exports = { connect };
