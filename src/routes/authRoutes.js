/**
 * Este archivo contiene las rutas necesarias para los endpoints de el modulo
 * autenticación...
 */
import { Router } from "express";
import checkRevokedToken from "../middleware/checkRevokedToken.js";
import {
    getUsersController
} from "../controllers/authControllers.js";

const authRouter = Router();

// GET...
authRouter.get('/', getUsersController);

export default authRouter;