'use strict';

const { getDb } = require('../db');

/**
 * PUBLIC_INTERFACE
 * NotesRepository
 * Abstracts data access for notes across DB providers.
 */
class NotesRepository {
  /** This repository routes CRUD operations to the configured DB provider. */
  async create(note) {
    const db = getDb();
    return db.notes.create(note);
  }

  async findById(id, userId) {
    const db = getDb();
    return db.notes.findById(id, userId);
  }

  async findAllByUser(userId, search) {
    const db = getDb();
    return db.notes.findAllByUser(userId, search);
  }

  async update(id, userId, updates) {
    const db = getDb();
    return db.notes.update(id, userId, updates);
  }

  async remove(id, userId) {
    const db = getDb();
    return db.notes.remove(id, userId);
  }
}

module.exports = new NotesRepository();
