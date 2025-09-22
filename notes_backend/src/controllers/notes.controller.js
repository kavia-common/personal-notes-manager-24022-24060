'use strict';

const notesService = require('../services/notes.service');

/**
 * PUBLIC_INTERFACE
 * NotesController
 * Handles HTTP for notes resources.
 */
class NotesController {
  /** This controller translates HTTP requests to service calls and formats responses. */

  async create(req, res) {
    const { title, content, userId } = req.body;
    const note = await notesService.createNote({ title, content, userId });
    return res.status(201).json({ status: 'success', data: note });
  }

  async getById(req, res) {
    const { id } = req.params;
    const { userId } = req.query;
    const note = await notesService.getNoteById(id, userId);
    return res.status(200).json({ status: 'success', data: note });
  }

  async list(req, res) {
    const { userId, search } = req.query;
    const notes = await notesService.listNotes(userId, search);
    return res.status(200).json({ status: 'success', data: notes });
  }

  async update(req, res) {
    const { id } = req.params;
    const { userId } = req.query;
    const { title, content } = req.body;
    const note = await notesService.updateNote(id, userId, { title, content });
    return res.status(200).json({ status: 'success', data: note });
  }

  async remove(req, res) {
    const { id } = req.params;
    const { userId } = req.query;
    await notesService.deleteNote(id, userId);
    return res.status(204).send();
  }
}

module.exports = new NotesController();
