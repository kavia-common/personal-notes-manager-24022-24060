const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const routes = require('./routes');
const notesRoutes = require('./routes/notes.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/error');

const app = express();

// Security headers and CORS aligned with Ocean Professional theme (safe defaults, minimal surface)
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging with concise format
app.use(morgan('tiny'));

app.set('trust proxy', true);

// Dynamic OpenAPI server URL so docs work behind proxies/ports
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec, { explorer: true })(req, res, next);
});

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Health root routes
app.use('/', routes);

// Notes API
app.use('/api/notes', notesRoutes);

// 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

module.exports = app;
