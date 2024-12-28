/**
 * En este archivo encontraremos todos los servicios requeridos para manejar el modulo de autenticación,
 * esto para iniciar sesion, cerrar sesion, refrescar la sesión, modificar los datos del usuario y más...
 *
 * 1. Get Users para no repetir el username...
 * 2. Registrar cuenta
 * 3. Inicio de sesión
 * 4. Cerrar sesión
 */

import prisma from "../config/prismaClient.js";
import logging from "../config/logging.js";

/**
 * @method GET
 *
 * usernames...
 */
const getUsers = async () => {
    try {
        const response = await prisma.users.findMany({
            select: {
                user_name: true
            }
        });

        if(response.length === 0 || !response){
            logging.warning('No se encontraron users.');
            return 404;
        }

        return response.map(user => user.user_name);

    } catch (error) {
        logging.error('Error al obtener los usernames.');
        throw new Error('Error al obtener los usernames.');
    }
}

export { getUsers };