// express framework...
import express from "express";
//cors middleware to handle the cross-origin request...
import cors from "cors";
// logging...
import logging from './config/logging.js';
//middleware to handle the loggings...
import { loggingHandler } from './middleware/loggingMiddleware.js';
import { routeNotFound } from './middleware/routeNotFoundMiddleware.js';

// create an instance of the express application...
const app = express();
// use cors...
app.use(cors());
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

// routes...
app.get('/', (_, res) => {
    return res.render('index.ejs', { title: 'API Taskify', message: 'Hello' });
});

// this middleware helps us to send an error message if any route doesn't exist...
app.use(routeNotFound);

export default app;