'use strict';

/**
 * Very lightweight structured logger.
 * Aligns with Ocean Professional: clarity, minimal noise, consistent structure.
 */
const Logger = {
  info: (msg, meta = {}) => console.log(JSON.stringify({ level: 'info', msg, ...meta })),
  warn: (msg, meta = {}) => console.warn(JSON.stringify({ level: 'warn', msg, ...meta })),
  error: (msg, meta = {}) => console.error(JSON.stringify({ level: 'error', msg, ...meta })),
};

module.exports = Logger;
