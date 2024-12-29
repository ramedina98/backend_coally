/**
 * Este archivo contiene todos los servicios necesarios para procesar los endpoints
 * necesarios para el modulo user, permitiendonos:
 *
 * 1. Editar la información del usuario.
 * 2. Obtener la información basica del usuario.
 * 3. Editar su contraseña.
 */
import { extractUserInfo } from "../utils/authUtils.js"
import { SERVER } from "../config/config.js"
import prisma from "../config/prismaClient.js"
import logging from "../config/logging.js"
import bcrypt from "bcryptjs"

/**
 * @method GET
 *
 * This service helps me to obtain the info of a specific user, using
 * the session token...
 */
const getUserInfo = async (id_user) => {
    try {
        const response = await prisma.findFirst({
            where: {
                id_user: id_user
            }
        });

        if(!response){
            logging.warning('No se encontro al usuario.')
            return 404;
        }

        return response;
    } catch (error) {
        logging.error('Error al obtener la información del usuario.');
        throw new Error('Error al obtener la información del usuario.');
    }
}

/**
 * @method PUT
 *
 * This service helps me to update the personal info of a specific
 * user, searching the user by its id_user...
 */
const updateUserInfo = async (id_user, data) => {
    try {
        const updatedData = await prisma.users.update({
            where: {
                id_user: id_user
            },
            data: {
                nombre1: data.nombre1,
                nombre2: data.nombre2,
                apellido1: data.apellido1,
                apellido2: data.apellido2,
                email: data.email,
                user_name: data.user_name,
            }
        });

        return updatedData;
    } catch (error) {
        logging.error('Error al actualizar la información del usuario.');
        throw new Error('Error al actualizar la información del usuario.');
    }
}

/**
 * @method PATCH
 *
 * Service to handle the process of update the password of a specific user...
 */
const updateUserPassword = async (id, oldPassword, newPassword) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                id_user: id
            }
        });

        if(!user){
            logging.warning('Usuario no encontrado.');
            return 404;
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            logging.error('Contraseña incorrecta.');
            return 401;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await prisma.users.update({
            where: {
                id_user: id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return `${user.nombre1} ${user.apellido1} contraseña actualizada.`;
    } catch (error) {
        logging.error('Error al actualizar contraseña.');
        throw new Error('Error al actualizar contraseña.');
    }
}

export {
    getUserInfo,
    updateUserInfo,
    updateUserPassword
};