/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para el módulo de autenticación
 */
import { Router } from "express";
import {
    getUsersController,
    newUserRegisterController,
    loginController,
    logoutController,
    refreshTokenController,
    recoverdPasswordController,
    resetForgotenPasswordController
} from "../controllers/authControllers.js";
import checkRevokedToken from "../middleware/checkRevokedToken.js";

const authRouter = Router();

// GET...

/**
 * @swagger
 * /auth/:
 *   get:
 *     summary: Obtener un objeto con dos arrays, uno con usernames y otro de emails, esto para que en el formulario de nuevos usuarios no deje que ingresen user_names repetidos o creen otra cuenta con el mismo correo.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Objeto con usernames y emails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usernames:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Usernames ya registrados.
 *                 emails:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Emails registrados.
 */

authRouter.get('/', getUsersController);

// POST...

/**
 * @swagger
 * /auth/new-user/:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              user_data:
 *                   type: object
 *                   properties:
 *                     nombre1:
 *                       type: string
 *                       description: Primer nombre del usuario.
 *                     nombre2:
 *                       type: string
 *                       description: Segundo nombre del usuario, si es que tiene uno.
 *                     apellido1:
 *                       type: string
 *                       description: Apellido paterno.
 *                     apellido2:
 *                       type: string
 *                       description: Apellido materno.
 *                     email:
 *                       type: string
 *                       description: Email.
 *                     user_name:
 *                       type: string
 *                       description: Nombre de usuario.
 *                     password:
 *                       type: string
 *                       description: Contraseña del usuario.
 *     responses:
 *       201:
 *         description: Nuevo usuario registrado username
 *       400:
 *         description: Faltan campos obligatorios
 */
authRouter.post('/new-user/', newUserRegisterController);
/**
 * @swagger
 * /auth/login/:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Bienvenido de vuelta username
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de bienvenida con el nombre de usuario
 *                 accessToken:
 *                   type: string
 *                   description: Token de acceso JWT renovado
 *         headers:
 *           Set-Cookie:
 *             description: Cookie que contiene el refreshToken
 *             schema:
 *               type: string
 *               example: refreshToken=your-refresh-token; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400000
 *       400:
 *          description: Usuario no proporcionado. || Contraseña no proporcionado.
 *       404:
 *          description: User name incorrecto.
 *       401:
 *          decription: Contraseña incorrecto.
 */
authRouter.post('/login/', loginController);
/**
 * @swagger
 * /auth/logout/:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorization:
 *                 type: string
 *                 description: Token de acceso JWT enviado en el encabezado `Authorization` con el prefijo `Bearer`
 *               refreshToken:
 *                 type: string
 *                 description: Token de actualización recibido como cookie `refreshToken`
 *     responses:
 *       200:
 *         description: Cerrando sesión
 *       400:
 *         description: Token inválido o revocado
 *       404:
 *          description: Refresh token not provided.
 */
authRouter.post('/logout/', checkRevokedToken, logoutController);
/**
 * @swagger
 * /auth/refresh-token/:
 *   post:
 *     summary: Renovar el token de autenticación
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de actualización (refresh token) recibido como cookie `refreshToken`
 *     responses:
 *       201:
 *         description: Token creado con exito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Nuevo token JWT
 *       401:
 *         description: Token not provided.
 *       404:
 *          description: El token no es valido o ha sido revocado.
 *       403:
 *          description: Error decoding the JWT.
 */
authRouter.post('/refresh-token/', checkRevokedToken, refreshTokenController);
/**
 * @swagger
 * /auth/recover-password/:
 *   post:
 *     summary: Enviar correo de recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Username del usuario
 *     responses:
 *       200:
 *         description: Se le envión un correo de recuperación a su correo registrado.
 *       404:
 *         description: Data not provided.
 *       422:
 *          DESCRIPTION: El usuario username no fue encontrado.
 */
authRouter.post('/recover-password/', recoverdPasswordController);
// PUT...
/**
 * @swagger
 * /reset-forgoten-password/:
 *   put:
 *     summary: Restablecer contraseña olvidada
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token recibido en el correo de recuperación
 *               newPass:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Su contraseña a sido actualizada correctamente.
 *       400:
 *         description: Token expirado o usuario incorrecto
 *       404:
 *         description: Token or password not provied.
 */
authRouter.put('/reset-forgoten-password/', resetForgotenPasswordController);

export default authRouter;