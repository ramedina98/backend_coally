/**
 * Este archivo contiene las rutas necesarias para los endpoints de el modulo
 * autenticación...
 */
import { Router } from "express";
import checkRevokedToken from "../middleware/checkRevokedToken.js";
import {
    getUsersController,
    newUserRegisterController,
    loginController,
    logoutController
} from "../controllers/authControllers.js";

const authRouter = Router();

// GET...
authRouter.get('/', getUsersController);
// POST...
authRouter.post('/new-user/', newUserRegisterController);
authRouter.post('/login/', loginController);
authRouter.post('/logout/', logoutController);

export default authRouter;