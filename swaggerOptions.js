const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your Express TypeScript API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your actual server URL
      },
    ],
  },
  apis: ['src/**/*.ts'], // Update with your actual source file patterns
};

module.exports = options;
