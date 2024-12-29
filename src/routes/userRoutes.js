/**
 * Este archivo contiene todas las rutas necesarias para el funcionamiento del
 * modulo user...
 */
import { Router } from "express";
import {
    getUserInfoController,
    updateUserInfoController,
    updateUserPasswordController
} from "../controllers/userControllers";
import checkRevokedToken from "../middleware/checkRevokedToken.js";

const userRouter = Router();

// GET...
userRouter.get('/', checkRevokedToken, getUserInfoController);
// PUT...
userRouter.put('/update-user-info/', checkRevokedToken, updateUserInfoController);
//PATCH
userRouter.patch('/update-user-password/', checkRevokedToken, updateUserPasswordController);

export default userRouter;