/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para el módulo de usuarios.
 */
import { Router } from "express";
import {
    getUserInfoController,
    updateUserInfoController,
    updateUserPasswordController
} from "../controllers/userControllers.js";
import checkRevokedToken from "../middleware/checkRevokedToken.js";

const userRouter = Router();

// GET...
/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Obtener la información de un usuario específico
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos encontrados."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: string
 *                       description: ID del usuario
 *                       example: cm58p43p300001m1ikauiq958
 *                     nombre1:
 *                       type: string
 *                       description: Primer nombre del usuario
 *                       example: "Juan"
 *                     nombre2:
 *                       type: string
 *                       description: Segundo nombre del usuario
 *                       example: "Carlos"
 *                     apellido1:
 *                       type: string
 *                       description: Primer apellido del usuario
 *                       example: "Pérez"
 *                     apellido2:
 *                       type: string
 *                       description: Segundo apellido del usuario
 *                       example: "González"
 *                     email:
 *                       type: string
 *                       description: Email del usuario
 *                       example: "juan.perez@gmail.com"
 *                     username:
 *                       type: string
 *                       description: Nombre de usuario
 *                       example: "juanperez"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se encontró al usuario."
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión expirada."
 *       403:
 *         description: Token revocado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión expirada."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener la información del usuario."
 */
userRouter.get('/', checkRevokedToken, getUserInfoController);
// PUT...
/**
 * @swagger
 * /user/update-user-info/:
 *   put:
 *     summary: Actualizar la información personal de un usuario específico
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre1:
 *                 type: string
 *                 description: Primer nombre del usuario
 *                 example: "Juan"
 *               nombre2:
 *                 type: string
 *                 description: Segundo nombre del usuario
 *                 example: "Carlos"
 *               apellido1:
 *                 type: string
 *                 description: Primer apellido del usuario
 *                 example: "Pérez"
 *               apellido2:
 *                 type: string
 *                 description: Segundo apellido del usuario
 *                 example: "González"
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *                 example: "juan.perez@gmail.com"
 *               user_name:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: "juanperez"
 *     responses:
 *       200:
 *         description: Datos del usuario actualizados con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos actualizados"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: string
 *                       description: ID del usuario
 *                       example: cm58p43p300001m1ikauiq958
 *                     nombre1:
 *                       type: string
 *                       description: Primer nombre del usuario
 *                       example: "Juan"
 *                     nombre2:
 *                       type: string
 *                       description: Segundo nombre del usuario
 *                       example: "Carlos"
 *                     apellido1:
 *                       type: string
 *                       description: Primer apellido del usuario
 *                       example: "Pérez"
 *                     apellido2:
 *                       type: string
 *                       description: Segundo apellido del usuario
 *                       example: "González"
 *                     email:
 *                       type: string
 *                       description: Email del usuario
 *                       example: "juan.perez@gmail.com"
 *                     username:
 *                       type: string
 *                       description: Nombre de usuario
 *                       example: "juanperez"
 *       400:
 *         description: No se proporcionaron datos para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se proporcionaron datos para actualizar."
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión expirada."
 *       403:
 *         description: Token revocado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión expirada."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la información del usuario."
 */
userRouter.put('/update-user-info/', checkRevokedToken, updateUserInfoController);
//PATCH
/**
 * @swagger
 * /user/update-user-password/:
 *   patch:
 *     summary: Actualizar la contraseña de un usuario específico
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   oldPassword:
 *                     type: string
 *                     description: Contraseña actual del usuario
 *                     example: "oldPassword123"
 *                   newPassword:
 *                     type: string
 *                     description: Nueva contraseña del usuario
 *                     example: "newPassword456"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Juan Pérez contraseña actualizada."
 *       400:
 *         description: Datos no proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos no proporcionados."
 *       401:
 *         description: Contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña incorrecta."
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la contraseña."
 */
userRouter.patch('/update-user-password/', checkRevokedToken, updateUserPasswordController);

export default userRouter;