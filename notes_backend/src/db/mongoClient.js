'use strict';

const { MongoClient, ObjectId } = require('mongodb');
const { getConfig } = require('../config');

let mongoClient;
let db;

/**
 * PUBLIC_INTERFACE
 * connect
 * Connect to MongoDB and provide a minimal repository helper API.
 */
async function connect() {
  /** This function connects to Mongo and returns a provider with helpers. */
  const cfg = getConfig();
  if (!cfg.mongo.uri) throw new Error('MONGO_URI is required for mongo client');
  if (!cfg.mongo.dbName) throw new Error('MONGO_DB_NAME is required for mongo client');

  mongoClient = new MongoClient(cfg.mongo.uri);
  await mongoClient.connect();
  db = mongoClient.db(cfg.mongo.dbName);

  const collectionName = cfg.mongo.notesCollection || 'notes';
  const col = () => db.collection(collectionName);

  return {
    type: 'mongo',
    close: async () => mongoClient?.close(),
    isHealthy: async () => {
      try {
        await db.command({ ping: 1 });
        return true;
      } catch {
        return false;
      }
    },
    ObjectId,

    // CRUD operations
    notes: {
      create: async (note) => {
        const now = new Date();
        const doc = { ...note, createdAt: now, updatedAt: now };
        const result = await col().insertOne(doc);
        return { ...doc, id: result.insertedId.toString(), _id: undefined };
      },
      findById: async (id, userId) => {
        const doc = await col().findOne({ _id: new ObjectId(id), userId });
        if (!doc) return null;
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest };
      },
      findAllByUser: async (userId, search) => {
        const filter = { userId };
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
          ];
        }
        const items = await col().find(filter).sort({ updatedAt: -1 }).toArray();
        return items.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
      },
      update: async (id, userId, updates) => {
        const now = new Date();
        const { value } = await col().findOneAndUpdate(
          { _id: new ObjectId(id), userId },
          { $set: { ...updates, updatedAt: now } },
          { returnDocument: 'after' }
        );
        if (!value) return null;
        const { _id, ...rest } = value;
        return { id: _id.toString(), ...rest };
      },
      remove: async (id, userId) => {
        const res = await col().deleteOne({ _id: new ObjectId(id), userId });
        return res.deletedCount > 0;
      },
    },
  };
}

module.exports = { connect };
