'use strict';

const express = require('express');
const { body, query, param } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const notesController = require('../controllers/notes.controller');

const router = express.Router();

function handleValidationErrors(req, res, next) {
  const { validationErrors } = req;
  if (validationErrors && validationErrors.length) {
    return next(new ApiError(400, validationErrors[0].msg, 'VALIDATION_ERROR'));
  }
  return next();
}
function validate(validations) {
  return async (req, res, next) => {
    const runAll = validations.map((v) => v.run(req));
    await Promise.all(runAll);
    const result = require('express-validator').validationResult(req);
    if (!result.isEmpty()) {
      req.validationErrors = result.array();
    }
    return handleValidationErrors(req, res, next);
  };
}

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Manage personal notes
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: List notes for a user
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner user id
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term (title or content)
 *     responses:
 *       200:
 *         description: List of notes
 */
router.get(
  '/',
  validate([query('userId').isString().notEmpty().withMessage('userId is required')]),
  asyncHandler(notesController.list.bind(notesController))
);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note found
 *       404:
 *         description: Note not found
 */
router.get(
  '/:id',
  validate([
    param('id').isString().notEmpty().withMessage('id is required'),
    query('userId').isString().notEmpty().withMessage('userId is required'),
  ]),
  asyncHandler(notesController.getById.bind(notesController))
);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, userId]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  validate([
    body('title').isString().notEmpty().withMessage('title is required'),
    body('content').isString().notEmpty().withMessage('content is required'),
    body('userId').isString().notEmpty().withMessage('userId is required'),
  ]),
  asyncHandler(notesController.create.bind(notesController))
);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
  '/:id',
  validate([
    param('id').isString().notEmpty().withMessage('id is required'),
    query('userId').isString().notEmpty().withMessage('userId is required'),
    body().custom((b) => b.title !== undefined || b.content !== undefined).withMessage('title or content required'),
  ]),
  asyncHandler(notesController.update.bind(notesController))
);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete(
  '/:id',
  validate([
    param('id').isString().notEmpty().withMessage('id is required'),
    query('userId').isString().notEmpty().withMessage('userId is required'),
  ]),
  asyncHandler(notesController.remove.bind(notesController))
);

module.exports = router;
