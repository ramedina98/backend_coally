/**
 * En este archivo encontraremos todos los servicios requeridos para que los controladores
 * del modulo tasks funcionen correctamente esto para:
 *
 * 1. POST: Crear tareas.
 * 2. GET: Listar todas las tareas con opcion a filtrar por estado...
 * 3. GET: Obtener detalles de una tarea...
 * 4. PUT: Actualizar tarea
 * 5. DELETE: elimitar una tarea
 */
import Task from "../models/tasksModel.js";
import logging from "../config/logging.js";
import formatDateTime from "../utils/timeUtils.js";

/**
 * @method POST
 *
 * Este servicio nos ayudara a crear nuevas tareas, guardandolas correctamente en la base de datos...
 * @param { title, description }
 */
const createNewTask = async (title, description) => {
    try {
        const task = new Task({ title, description });
        const savedTask = await task.save();

        if(!savedTask){
            logging.error('Task creation failed.');
            throw new Error('Task creation failed.');
        }

        const data = {
            id: savedTask._id,
            title: savedTask.title,
            description: savedTask.description,
            completed: savedTask.completed,
            // is shipped as an object to make it easier for the front end to fit on the screen
            createdAt: formatDateTime(savedTask.createdAt)
        }

        return data;
    } catch (error) {
        logging.error(error.message || 'Error creating task');
        throw new Error(error.message || 'Error creating task');
    }
}

/**
 * @method GET
 *
 * this service returns a list of tasks, and they can be filtered by true or false...
 */
const getTasks = async (status) => {
    try {
        const filter = {};
        if (status !== undefined) {
            filter.completed = status === 'true';
        }

        let tasks = await Task.find(filter);

        if(tasks.length !== 0){
            return tasks.map(t => {
                return{
                    id: t._id,
                    title: t.title,
                    description: t.description,
                    completed: t.completed,
                    // is shipped as an object to make it easier for the front end to fit on the screen
                    createdAt: formatDateTime(t.createdAt)
                }
            });
        }

        return tasks;
    } catch (error) {
        logging.error('Error al obtener las tareas: ' + error.message);
        throw new Error('Error al obtener las tareas: ' + error.message);
    }

}

/**
 * @method get
 * This service helps to search and return a specific tasks by its id...
 */
const getTask = async (id) => {
    try {
        const task = await Task.findById(id);
        return {
            id: task._id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            // is shipped as an object to make it easier for the front end to fit on the screen
            createdAt: formatDateTime(task.createdAt)
        }
    } catch (error) {
        logging.error('Error al obtener la tarea: ' + error.message);
        throw new Error('Error al obtener la tarea: ' + error.message);
    }
}

/**
 * @method PUT
 *
 * This service helps in the process of update an specific task register...
 */
const updateATask = async (id, updateData) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        return {
            id: updatedTask._id,
            title: updatedTask.title,
            description: updatedTask.description,
            completed: updatedTask.completed,
            // is shipped as an object to make it easier for the front end to fit on the screen
            createdAt: formatDateTime(updatedTask.createdAt)
        };
    } catch (error) {
        logging.error('Error al actualizar la tarea: ' + error.message);
        throw new Error('Error al actualizar la tarea: ' + error.message);
    }
}

/**
 * @method DELETE
 *
 * This service helps me to delete an specific task searching it by its id...
 */
const deleteATask = async (id) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        return {
            id: deletedTask._id,
            title: deletedTask.title,
            description: deletedTask.description,
            completed: deletedTask.completed,
            // is shipped as an object to make it easier for the front end to fit on the screen
            createdAt: formatDateTime(deletedTask.createdAt)
        };
    } catch (error) {
        logging.error('Error al borrar la tarea: ' + error.message);
        throw new Error('Error al borrar la tarea: ' + error.message);
    }
}

export {
    createNewTask,
    getTasks,
    getTask,
    updateATask,
    deleteATask
}