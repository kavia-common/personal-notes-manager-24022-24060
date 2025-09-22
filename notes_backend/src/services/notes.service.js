'use strict';

const notesRepo = require('../repositories/notes.repository');
const ApiError = require('../utils/ApiError');

/**
 * PUBLIC_INTERFACE
 * NotesService
 * Encapsulates business logic for managing notes.
 */
class NotesService {
  /** This service validates inputs, enforces ownership, and delegates to repository. */

  async createNote({ title, content, userId }) {
    if (!title || !content || !userId) {
      throw new ApiError(400, 'title, content, and userId are required', 'VALIDATION_ERROR');
    }
    return notesRepo.create({ title, content, userId });
  }

  async getNoteById(id, userId) {
    if (!id || !userId) throw new ApiError(400, 'id and userId are required', 'VALIDATION_ERROR');
    const note = await notesRepo.findById(id, userId);
    if (!note) throw new ApiError(404, 'Note not found', 'NOT_FOUND');
    return note;
  }

  async listNotes(userId, search) {
    if (!userId) throw new ApiError(400, 'userId is required', 'VALIDATION_ERROR');
    return notesRepo.findAllByUser(userId, search);
  }

  async updateNote(id, userId, { title, content }) {
    if (!id || !userId) throw new ApiError(400, 'id and userId are required', 'VALIDATION_ERROR');
    if (title === undefined && content === undefined) {
      throw new ApiError(400, 'Nothing to update', 'VALIDATION_ERROR');
    }
    const updated = await notesRepo.update(id, userId, { title, content });
    if (!updated) throw new ApiError(404, 'Note not found', 'NOT_FOUND');
    return updated;
  }

  async deleteNote(id, userId) {
    if (!id || !userId) throw new ApiError(400, 'id and userId are required', 'VALIDATION_ERROR');
    const ok = await notesRepo.remove(id, userId);
    if (!ok) throw new ApiError(404, 'Note not found', 'NOT_FOUND');
    return true;
  }
}

module.exports = new NotesService();
