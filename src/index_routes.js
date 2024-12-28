/**
 * @routes
 *
 * This file contains all the necessary routes for the management of all
 * the api endpoints. This way I have a correct order of all of them...
 *
 * auth module
 * tasks module
 */
import tasksRouter from "./routes/tasksRoutes.js";
import authRouter from "./routes/authRoutes.js";

export default function allRoutes(app) {
    // auth routes...
    app.use('/auth', authRouter);
    // tasks routes...
    app.use('/task', tasksRouter);
}