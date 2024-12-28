/**
 * En este archivo encontraremos todos los servicios requeridos para manejar el modulo de autenticación,
 * esto para iniciar sesion, cerrar sesion, refrescar la sesión, modificar los datos del usuario y más...
 *
 * 2. Registrar cuenta
 * 3. Inicio de sesión
 * 4. Cerrar sesión
 */
import { extractUserInfo, generateRefreshToken, token } from "../utils/authUtils.js";
import { SERVER } from "../config/config.js";
import bcrypt from "bcryptjs";
import prisma from "../config/prismaClient.js";
import logging from "../config/logging.js";
import { decode } from "jsonwebtoken";

/**
 * @method GET
 *
 * usernames...
 */
const getUsers = async () => {
    try {
        const response = await prisma.users.findMany();

        if(response.length === 0 || !response){
            logging.warning('No se encontraron users.');
            return 404;
        }

        const usernames = response.map(user => user.user_name);
        const emails = response.map(user => user.email);

        return {
            usernames,
            emails
        };

    } catch (error) {
        logging.error('Error al obtener los usernames.');
        throw new Error('Error al obtener los usernames.');
    }
}

/**
 * @method POST
 * @param {user_data{}}
 *
 * register new user...
 */
const newUserRegister = async (user_data) => {
    const { nombre1, nombre2, apellido1, apellido2, email, user_name, password } = user_data;
    try {
        // verify all the fields...
        if (!nombre1 || !apellido1 || !apellido2 || !email || !user_name || !password) {
            logging.warning('Faltan campos obligatorios');
            return 400;
        }

        // first encrypt the password...
        const encryptedPass = await bcrypt.hash(password, 10);

        // then create the new register...
        const newUser = await prisma.users.create({
            data: {
                nombre1,
                nombre2,
                apellido1,
                apellido2,
                email,
                user_name,
                password: encryptedPass
            }
        });

        logging.info(`Nuevo usuario registrado: ${newUser.user_name}`);

        return `${newUser.nombre1} ${newUser.apellido1} bienvenido!.`;
    } catch (error) {
        logging.error('Error al registrar el usuario.');
        throw new Error('Error al registrar el usuario.');
    }
}

/**
 * @method POST
 *
 * Login service...
 */
const login = async (user_name, password) => {
    try {
        // make the query to serach the user by its username...
        const user = await prisma.users.findFirst({
            where: {
                user_name: user_name
            }
        });

        if(!user){
            logging.error('User name incorrect.');
            return 404;
        }

        // compare the hashed password...
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            logging.error('Password incorrect.');
            return 401;
        }

        // create the access token...
        const accessToken = token(user, SERVER.JWT_TIME);
        // create the refresh token...
        const refresh_tokens = await generateRefreshToken(user);

        return {
            accessToken,
            refresh_tokens
        }
    } catch (error) {
        logging.error('Error al iniciar sesión.');
        throw new Error('Error al iniciar sesión.');
    }
}

/**
 * @method POST
 *
 * Logout service...
 */
const logout = async (token) => {
    try {
        // decoded the token to retrieve the id_user...
        const decoded = extractUserInfo(token, id_user);

        if(decoded === null){
            logging.warning('Token expirado o incorrecto.');
            return 400;
        }

        // insert the token into the revoked_tokens table...
        await prisma.revoked_tokens.create({
            data: {
                token,
                user_id: decoded
            },
        });

        logging.info(`Token revocado.`);

        return 201;
    } catch (error) {
        logging.error(`Error: ${error.message}`);
        throw new Error(`Error: ${error.message}`);
    }
}

export { getUsers, newUserRegister, login, logout };