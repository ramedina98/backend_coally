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
    logoutController,
    refreshTokenController,
    recoverdPasswordController,
    resetForgotenPasswordController
} from "../controllers/authControllers.js";

const authRouter = Router();

// GET...
authRouter.get('/', getUsersController);
// POST...
authRouter.post('/new-user/', newUserRegisterController);
authRouter.post('/login/', loginController);
authRouter.post('/logout/', checkRevokedToken, logoutController);
authRouter.post('/refresh-token/', checkRevokedToken, refreshTokenController);
authRouter.post('/recover-password/', recoverdPasswordController);
// PUT...
authRouter.put('/reset-forgoten-password/', resetForgotenPasswordController);

export default authRouter;