# Notes Backend (Express) - Personal Notes Manager

Modern, production-ready Express.js backend that provides CRUD REST APIs for managing personal notes. Built with separation of concerns, strong typing via JSDoc, robust error handling, centralized configuration, and OpenAPI documentation. Styled after the Ocean Professional guide (clean, minimal, well-structured, and thoughtfully commented).

Key features:
- RESTful CRUD endpoints for notes
- Separation of concerns (routes, controllers, services, repositories)
- Database abstraction with support for SQL or MongoDB via environment selection
- Centralized configuration and robust error handling
- Request validation using express-validator
- OpenAPI/Swagger documentation at /docs
- CORS, security headers, and graceful shutdown
- Health and readiness endpoints

Quick start
1. Install dependencies
   npm install

2. Configure environment
   Copy .env.example to .env and set values.

3. Run in dev
   npm run dev

4. Run in prod
   npm start

5. Open API docs
   http://localhost:3000/docs

Environment variables
Create a .env file from .env.example. Do not commit secrets.

Core vars:
- NODE_ENV: development|production|test
- PORT: Port to run the server (default 3000)
- HOST: Host to bind (default 0.0.0.0)
- DB_CLIENT: mongo|sql (default: mongo)
- For Mongo:
  - MONGO_URI: Full Mongo connection string (e.g. mongodb://user:pass@host:27017/db)
  - MONGO_DB_NAME: Database name
  - MONGO_NOTES_COLLECTION: Notes collection name (default: notes)
- For SQL (using Postgres-like URL):
  - SQL_URI: e.g. postgres://user:pass@host:5432/db
  - SQL_NOTES_TABLE: Notes table name (default: notes)

Notes API
Base path: /

- GET /health - Service health and environment
- GET /ready - Readiness check (DB connection)

Notes endpoints (all JSON):
- POST /api/notes
  Create a note
  Body: { title: string, content: string, userId: string }
  Returns: 201 + created note

- GET /api/notes
  List notes by userId
  Query: userId=string, optional search=string
  Returns: 200 + list

- GET /api/notes/:id
  Get note by id (must belong to userId)
  Query: userId=string
  Returns: 200 + note

- PUT /api/notes/:id
  Update note (title/content)
  Body: { title?: string, content?: string }, Query: userId=string
  Returns: 200 + updated note

- DELETE /api/notes/:id
  Delete note by id (must belong to userId)
  Query: userId=string
  Returns: 204

Project structure
src/
  app.js               Express app configuration
  server.js            Entrypoint and graceful shutdown
  config/
    index.js           Central app configuration
    logger.js          Simple structured logger
  db/
    index.js           DB initialization and provider selection
    mongoClient.js     Mongo connection and helpers
    sqlClient.js       SQL client (pg) and helpers
  routes/
    index.js           Root router and health
    notes.routes.js    Notes API routes with validation
  controllers/
    health.js          Health/ready controllers
    notes.controller.js Notes controller
  services/
    health.js          Health service
    notes.service.js   Business logic for notes
  repositories/
    notes.repository.js Data access layer for notes
  middleware/
    index.js           Export middleware
    error.js           Error handler
    notFound.js        404 handler
    requestLogger.js   Request logging
  utils/
    ApiError.js        Custom error class
    asyncHandler.js    Async route wrapper
swagger.js             Swagger generator

Ocean Professional notes
- Minimal, elegant comments above public interfaces
- Clear error messages and consistent structure
- Safe defaults and graceful failures
- Prefer clarity over cleverness; defensive coding

License
MIT
