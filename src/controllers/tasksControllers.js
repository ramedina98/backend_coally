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
    createNewTask,
    getTasks,
    getTask,
    updateATask,
    deleteATask
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

/**
 * @method GET
 * Controller to retrieve tasks...
 */
const getTasksController = async (req, res) => {
    const { status } = req.query;

    try {
        const tasks = await getTasks(status);

        return res.status(200).json({
            message: 'Tareas encontradas',
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
};

/**
 * @method GET
 *
 * Controller for retrieve an specific task...
 */
const getTaskController = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the task...
        const task = await getTask(id);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({message: 'Tarea encontrada', task});
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
};

/**
 * @method PUT
 * Controller for update an specific task...
 */
const updateATaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if(!updateData){
            return res.status(400).json({ message: 'Datos para actualizar no proporcionados.' });
        }

        const updatedTask = await updateATask(id, updateData);

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // send the update tasks as response...
        res.status(200).json({message: 'Actualización exitosa.', updatedTask});
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
};

/**
 * @method DELETE
 *
 * Controller for delete an specific task...
 */
const deleteTaskController = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await deleteATask(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({ message: 'Tarea eliminada con éxito', deletedTask });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
};

export {
    createNewTaskController,
    getTasksController,
    getTaskController,
    updateATaskController,
    deleteTaskController
}