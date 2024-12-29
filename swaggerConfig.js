import { SERVER } from './src/config/config.js';
import swaggerJsdoc from 'swagger-jsdoc';

const PORT =  process.env.PORT || SERVER.SERVER_PORT;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend API Documentation Coally',
            version: '1.0.0',
            description: 'API documentation for the backend Coally techninca test ',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;