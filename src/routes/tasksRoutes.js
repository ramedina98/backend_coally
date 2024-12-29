/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tasks by status (completed or pending)
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   completed:
 *                     type: boolean
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
tasksRouter.get('/', checkRevokedToken, getTasksController);
tasksRouter.get('/:id', checkRevokedToken, getTaskController);
// POST...
tasksRouter.post('/new-task/', checkRevokedToken, createNewTaskController);
// PUT...
tasksRouter.put('/update-task/:id', checkRevokedToken, updateATaskController);
// DELETE
tasksRouter.delete('/delete-task/:id', checkRevokedToken, deleteTaskController);

export default tasksRouter;