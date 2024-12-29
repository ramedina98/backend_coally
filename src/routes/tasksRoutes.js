/**
 * Este archivo contiene las rutas requeridas para el funcionamiento del modulo tasks,
 * accesos directos a los endpoints...
 *
 * 1. POST: Crear tareas.
 * 2. GET: Listar todas las tareas con opcion a filtrar por estado...
 * 3. GET: Obtener detalles de una tarea...
 * 4. PUT: Actualizar tarea
 * 5. DELETE: elimitar una tarea
 */
import { Router } from "express";
import {
    createNewTaskController,
    getTasksController,
    getTaskController,
    updateATaskController,
    deleteTaskController
} from "../controllers/tasksControllers.js";
import checkRevokedToken from "../middleware/checkRevokedToken.js";

const tasksRouter = Router();

// GET...
tasksRouter.get('/', getTasksController);
tasksRouter.get('/:id', getTaskController);
// POST...
tasksRouter.post('/new-task/', createNewTaskController);
// PUT...
tasksRouter.put('/update-task/:id', updateATaskController);
// DELETE
tasksRouter.delete('/delete-task/:id', deleteTaskController);

export default tasksRouter;