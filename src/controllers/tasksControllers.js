/**
 * Este archivo es el encargado de gestionar los controllers necesarios para el
 * funcionamiento del tasks module...
 *
 * Usa los siguientes servicios:
 *
 * 1. POST: Crear tareas.
 * 2. GET: Listar todas las tareas con opcion a filtrar por estado...
 * 3. GET: Obtener detalles de una tarea...
 * 4. PUT: Actualizar tarea
 * 5. DELETE: elimitar una tarea
 */
import {
    createNewTask
} from "../services/tasksServices.js";

/**
 * @method POST
 *
 * This controller helps me to create new tasks...
 */
const createNewTaskController = async (req, res) => {
    const { title, description } = req.body;

    if(!title || title === "") {
        return res.status(400).json({
            message: 'El titulo no ha sido proveido.'
        });
    }

    try {
        // calling the service to create the task...
        const task = await createNewTask(title, description);

        // if the taks was created successfully, response with 201 status...
        return res.status(201).json({
            message: 'Nueva tarea añadida.',
            task
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

export { createNewTaskController }