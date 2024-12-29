/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Endpoints para el módulo de tareas...
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
/**
 * @swagger
 * /task/:
 *   get:
 *     summary: Obtener lista de tareas
 *     tags: [Task]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filtrar tareas por estado de completado (true o false)
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           example: "true"
 *     responses:
 *       200:
 *         description: Tareas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tareas encontradas"
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID de la tarea
 *                         example: "507f1f77bcf86cd799439011"
 *                       title:
 *                         type: string
 *                         description: Título de la tarea
 *                         example: "Comprar víveres"
 *                       description:
 *                         type: string
 *                         description: Descripción de la tarea
 *                         example: "Comprar arroz, frijoles y pan"
 *                       completed:
 *                         type: boolean
 *                         description: Estado de la tarea
 *                         example: false
 *                       createdAt:
 *                         type: object
 *                         description: Fecha y hora de creación de la tarea
 *                         properties:
 *                           formattedDate:
 *                             type: string
 *                             description: Fecha formateada (dd/mm/yyyy)
 *                             example: "29/12/2024"
 *                           formattedTime:
 *                             type: string
 *                             description: Hora formateada (hh:mm:ss AM/PM)
 *                             example: "01:04:48 AM"
 *       500:
 *         description: Error al obtener las tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener las tareas."
 */

tasksRouter.get('/', checkRevokedToken, getTasksController);
/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Obtener tarea específica
 *     tags: [Task]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea a obtener
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarea encontrada"
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la tarea
 *                       example: "507f1f77bcf86cd799439011"
 *                     title:
 *                       type: string
 *                       description: Título de la tarea
 *                       example: "Comprar víveres"
 *                     description:
 *                       type: string
 *                       description: Descripción de la tarea
 *                       example: "Comprar arroz, frijoles y pan"
 *                     completed:
 *                       type: boolean
 *                       description: Estado de la tarea
 *                       example: false
 *                     createdAt:
 *                       type: object
 *                       description: Fecha y hora de creación de la tarea
 *                       properties:
 *                         formattedDate:
 *                           type: string
 *                           description: Fecha formateada (dd/mm/yyyy)
 *                           example: "29/12/2024"
 *                         formattedTime:
 *                           type: string
 *                           description: Hora formateada (hh:mm:ss AM/PM)
 *                           example: "01:04:48 AM"
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarea no encontrada"
 *       500:
 *         description: Error al obtener la tarea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener la tarea."
 */
tasksRouter.get('/:id', checkRevokedToken, getTaskController);
// POST...
/**
 * @swagger
 * /task/new-task/:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Task]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la tarea
 *                 example: "Comprar víveres"
 *               description:
 *                 type: string
 *                 description: Descripción de la tarea
 *                 example: "Comprar arroz, frijoles y pan"
 *     responses:
 *       201:
 *         description: Tarea creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nueva tarea añadida."
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la tarea
 *                       example: "507f1f77bcf86cd799439011"
 *                     title:
 *                       type: string
 *                       description: Título de la tarea
 *                       example: "Comprar víveres"
 *                     description:
 *                       type: string
 *                       description: Descripción de la tarea
 *                       example: "Comprar arroz, frijoles y pan"
 *                     completed:
 *                       type: boolean
 *                       description: Estado de la tarea
 *                       example: false
 *                     createdAt:
 *                       type: object
 *                       description: Fecha y hora de creación de la tarea
 *                       properties:
 *                         formattedDate:
 *                           type: string
 *                           description: Fecha formateada (dd/mm/yyyy)
 *                           example: "29/12/2024"
 *                         formattedTime:
 *                           type: string
 *                           description: Hora formateada (hh:mm:ss AM/PM)
 *                           example: "01:04:48 AM"
 *       400:
 *         description: El título no fue proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El titulo no ha sido proveído."
 *       500:
 *         description: Error al crear la tarea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creando la tarea."
 */
tasksRouter.post('/new-task/', checkRevokedToken, createNewTaskController);
// PUT...
/**
 * @swagger
 * /task/update-task/{id}:
 *   put:
 *     summary: Actualizar tarea específica
 *     tags: [Task]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea a actualizar
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la tarea
 *                 example: "Comprar leche"
 *               description:
 *                 type: string
 *                 description: Descripción de la tarea
 *                 example: "Comprar leche, pan y queso"
 *               completed:
 *                 type: boolean
 *                 description: Estado de la tarea
 *                 example: true
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Actualización exitosa."
 *                 updatedTask:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la tarea
 *                       example: "507f1f77bcf86cd799439011"
 *                     title:
 *                       type: string
 *                       description: Título de la tarea
 *                       example: "Comprar leche"
 *                     description:
 *                       type: string
 *                       description: Descripción de la tarea
 *                       example: "Comprar leche, pan y queso"
 *                     completed:
 *                       type: boolean
 *                       description: Estado de la tarea
 *                       example: true
 *                     createdAt:
 *                       type: object
 *                       description: Fecha y hora de creación de la tarea
 *                       properties:
 *                         formattedDate:
 *                           type: string
 *                           description: Fecha formateada (dd/mm/yyyy)
 *                           example: "29/12/2024"
 *                         formattedTime:
 *                           type: string
 *                           description: Hora formateada (hh:mm:ss AM/PM)
 *                           example: "01:04:48 AM"
 *       400:
 *         description: Datos para actualizar no proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos para actualizar no proporcionados."
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarea no encontrada."
 *       500:
 *         description: Error al actualizar la tarea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la tarea."
 */
tasksRouter.put('/update-task/:id', checkRevokedToken, updateATaskController);
// DELETE
/**
 * @swagger
 * /task/delete-task/{id}:
 *   delete:
 *     summary: Eliminar tarea específica
 *     tags: [Task]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea a eliminar
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarea eliminada con éxito."
 *                 deletedTask:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la tarea eliminada
 *                       example: "507f1f77bcf86cd799439011"
 *                     title:
 *                       type: string
 *                       description: Título de la tarea
 *                       example: "Comprar leche"
 *                     description:
 *                       type: string
 *                       description: Descripción de la tarea
 *                       example: "Comprar leche, pan y queso"
 *                     completed:
 *                       type: boolean
 *                       description: Estado de la tarea
 *                       example: true
 *                     createdAt:
 *                       type: object
 *                       description: Fecha y hora de creación de la tarea
 *                       properties:
 *                         formattedDate:
 *                           type: string
 *                           description: Fecha formateada (dd/mm/yyyy)
 *                           example: "29/12/2024"
 *                         formattedTime:
 *                           type: string
 *                           description: Hora formateada (hh:mm:ss AM/PM)
 *                           example: "01:04:48 AM"
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tarea no encontrada."
 *       500:
 *         description: Error al eliminar la tarea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al eliminar la tarea."
 */
tasksRouter.delete('/delete-task/:id', checkRevokedToken, deleteTaskController);

export default tasksRouter;