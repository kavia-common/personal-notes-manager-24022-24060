const healthService = require('../services/health');
const { getDb } = require('../db');

class HealthController {
  check(req, res) {
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }

  async ready(req, res) {
    try {
      const db = getDb();
      const ok = await db.isHealthy();
      if (!ok) {
        return res.status(503).json({ status: 'error', message: 'DB not ready' });
      }
      return res.status(200).json({ status: 'ok', message: 'Ready' });
    } catch {
      return res.status(503).json({ status: 'error', message: 'DB not initialized' });
    }
  }
}

module.exports = new HealthController();
