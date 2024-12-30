// express framework...
import express from "express";
import cookieParser from "cookie-parser";
//swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "../swaggerConfig.js";
//cors middleware to handle the cross-origin request...
import cors from "cors";
// logging...
import logging from './config/logging.js';
//middleware to handle the loggings...
import { loggingHandler } from './middleware/loggingMiddleware.js';
import { routeNotFound } from './middleware/routeNotFoundMiddleware.js';
import allRoutes from "./index_routes.js";

// create an instance of the express application...
const app = express();

// cookies...
app.use(cookieParser());

//swagger middleware...
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// use cors...
// Configuración dinámica para CORS
app.use((req, res, next) => {
    const origin = req.headers.origin; // Captura el origen de la solicitud
    res.setHeader('Access-Control-Allow-Origin', origin || '*'); // Configura el origen permitido
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permite credenciales
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeceras permitidas
    next();
});

// Manejo de solicitudes OPTIONS para preflight
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // Respuesta vacía para OPTIONS
});

app.use(express.urlencoded({ extended: true }));
// use middleware to parse JSON request bodies...
app.use(express.json());

// EJS configuration...
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Middleware para archivos estáticos
app.use(express.static('./public'));

// logging handler here...
logging.info('Loggin & configuration');
app.use(loggingHandler);

allRoutes(app);

// routes...
app.get('/', (_, res) => {
    return res.render('index.ejs', { title: 'API Taskify', message: 'Hello' });
});

// this middleware helps us to send an error message if any route doesn't exist...
app.use(routeNotFound);

export default app;