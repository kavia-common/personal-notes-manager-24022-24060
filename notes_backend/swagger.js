const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes Backend API',
      version: '1.0.0',
      description: 'REST API for managing personal notes. Ocean Professional style.',
    },
    tags: [
      { name: 'Notes', description: 'Manage personal notes' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
