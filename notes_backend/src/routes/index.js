const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /ready:
 *   get:
 *     summary: Readiness probe (DB connectivity)
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Not ready
 */
router.get('/ready', healthController.ready.bind(healthController));

module.exports = router;
