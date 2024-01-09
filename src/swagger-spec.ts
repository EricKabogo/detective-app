import swaggerJSDoc from 'swagger-jsdoc';

const options = require('../swaggerOptions');

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
