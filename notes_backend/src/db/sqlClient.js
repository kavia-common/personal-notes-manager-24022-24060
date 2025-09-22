'use strict';

const { Client } = require('pg');
const format = require('pg-format');
const { getConfig } = require('../config');
const { v4: uuidv4 } = require('uuid');

let client;

/**
 * PUBLIC_INTERFACE
 * connect
 * Connect to SQL DB and provide repository helper API for notes.
 */
async function connect() {
  /** This function connects to the SQL database and ensures schema. */
  const cfg = getConfig();
  if (!cfg.sql.uri) throw new Error('SQL_URI is required for sql client');

  client = new Client({ connectionString: cfg.sql.uri });
  await client.connect();

  const table = cfg.sql.notesTable || 'notes';

  // Ensure table exists (id uuid, title text, content text, user_id text, timestamps)
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${table} (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_${table}_user ON ${table} (user_id);
  `);

  return {
    type: 'sql',
    close: async () => client?.end(),
    isHealthy: async () => {
      try {
        await client.query('SELECT 1');
        return true;
      } catch {
        return false;
      }
    },
    notes: {
      create: async (note) => {
        const id = uuidv4();
        const now = new Date();
        const q = format(
          'INSERT INTO %I (id, title, content, user_id, created_at, updated_at) VALUES (%L, %L, %L, %L, %L, %L)',
          table,
          id,
          note.title,
          note.content,
          note.userId,
          now.toISOString(),
          now.toISOString()
        );
        await client.query(q);
        return { id, title: note.title, content: note.content, userId: note.userId, createdAt: now, updatedAt: now };
      },
      findById: async (id, userId) => {
        const q = format('SELECT * FROM %I WHERE id=%L AND user_id=%L', table, id, userId);
        const { rows } = await client.query(q);
        if (!rows[0]) return null;
        const row = rows[0];
        return mapRow(row);
      },
      findAllByUser: async (userId, search) => {
        let q;
        if (search) {
          q = format(
            'SELECT * FROM %I WHERE user_id=%L AND (title ILIKE %L OR content ILIKE %L) ORDER BY updated_at DESC',
            table,
            userId,
            `%${search}%`,
            `%${search}%`
          );
        } else {
          q = format('SELECT * FROM %I WHERE user_id=%L ORDER BY updated_at DESC', table, userId);
        }
        const { rows } = await client.query(q);
        return rows.map(mapRow);
      },
      update: async (id, userId, updates) => {
        const fields = [];
        const values = [];
        if (updates.title !== undefined) {
          fields.push('title');
          values.push(updates.title);
        }
        if (updates.content !== undefined) {
          fields.push('content');
          values.push(updates.content);
        }
        fields.push('updated_at');
        values.push(new Date().toISOString());

        if (fields.length === 0) return await this.findById(id, userId);

        const sets = fields.map((f, i) => `${f} = ${format('%L', values[i])}`).join(', ');
        const q = `UPDATE ${table} SET ${sets} WHERE id = ${format('%L', id)} AND user_id = ${format('%L', userId)} RETURNING *`;
        const { rows } = await client.query(q);
        if (!rows[0]) return null;
        return mapRow(rows[0]);
      },
      remove: async (id, userId) => {
        const q = format('DELETE FROM %I WHERE id=%L AND user_id=%L', table, id, userId);
        const res = await client.query(q);
        return res.rowCount > 0;
      },
    },
  };
}

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = { connect };
