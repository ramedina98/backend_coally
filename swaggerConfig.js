import { SERVER } from './src/config/config.js';
import swaggerJsdoc from 'swagger-jsdoc';
import fs from "fs";

function extractModuleName(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const match = fileContent.match(/@swagger\s+tags:\s+name:\s+(\w+)/i);
    return match ? match[1] : 'default';
}

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
    apis: ['./src/routes/*.js'], // Cambia esta ruta según la ubicación de tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;