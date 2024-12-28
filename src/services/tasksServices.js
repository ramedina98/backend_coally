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

        return savedTask;
    } catch (error) {
        logging.error(error.message || 'Error creating task');
        throw new Error(error.message || 'Error creating task');
    }
}

export { createNewTask }