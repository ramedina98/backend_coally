/**
 * En este archivo encontraremos todos los servicios requeridos para manejar el modulo de autenticación,
 * esto para iniciar sesion, cerrar sesion, refrescar la sesión, modificar los datos del usuario y más...
 *
 * 2. Registrar cuenta
 * 3. Inicio de sesión
 * 4. Cerrar sesión
 */
import { extractUserInfo, generateRefreshToken, token, recoveryToken } from "../utils/authUtils.js";
import { SERVER } from "../config/config.js";
import { secureEmailtoShow } from "../helper/emailFormatHelpers.js";
import EmailHandler from "../classes/EmailHandler.js";
import bcrypt from "bcryptjs";
import prisma from "../config/prismaClient.js";
import logging from "../config/logging.js";

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

/**
 * @method DELETE
 *
 * This services handle the process of delete the refreshToken, when the user logout
 * from the app...
 *
 * @param token
 */
const deleteRefreshToken = async (token) => {
    try {
        // first, looking for the token register...
        const token_record = await prisma.refresh_tokens.findFirst({
            where: { token: token }
        });

        if(token_record === null) throw new Error("Refresh token does not exist.");

        // eliminate the token...
        await prisma.refresh_tokens.delete({
            where: {id: token_record.id }
        });

    } catch (error) {
        logging.error(`Error: ${error.message}`);
        throw new Error(`Error: ${error.message}`);
    }
}

/**
 * @method POST
 *
 * This service handle the process to renew the sesion token...
 */
const refreshToken = async (reToken) => {
    try {
        // search the token in the table...
        const storedToken = await prisma.refresh_tokens.findFirst({
            where: { token: reToken }
        });

        if(!storedToken){
            logging.warning('El token no es valido o ha sido revocado.');
            return 404;
        }

        // extract the user data from the refresh token...
        const user_data = jwt.verify(reToken, SERVER.JWT_KEY);

        if(!user_data){
            logging.error('Error decoding the JWT.');
            return 403;
        }

        // Create a new token access...
        const newAccessToken = token(user_data, SERVER.JWT_TIME);

        // return the token...
        return newAccessToken;
    } catch (error) {
        logging.error(`Error: ${error.message}`);
        throw new Error(`Error: ${error.mesage}`);
    }
}

/**
 * @method POST
 *
 * This function helps me to recover a password, sending to the registered email the additional password,
 * which will be valid for a certain period of time...
 *
 * @param user_name
 */
const recoverdPassword = async (user_name) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                user_name
            }
        });

        // if the user does not exist let the client knows...
        if(!user){
            logging.warning('Usuario no encontrado');
            return 422;
        }

        // create the token...
        const token = recoveryToken(user.id_user);

        let subject = 'Recuperación de contraseña - Taskify.';
        // Mensaje padre
        let message = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de Contraseña</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #8399b0;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #dddddd;
                        border-radius: 5px;
                        background-color: #c8d3de;
                        shadow: 1px 1px 0pxrgba(20, 20, 20, 0.2);
                    }
                    .header {
                        text-align: center;
                    }
                    .recovery-code {
                        color: #1d3245;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 0.9em;
                        color:rgb(53, 70, 90);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h3>Estimado/a ${user.nombre1} ${user.apellido1}</h3>
                    </div>
                    <p>Por medio de este mensaje, le informamos que ha solicitado la recuperación de su contraseña.</p>
                    <p>Este es su código de recuperación de contraseña: <span class="recovery-code">${token}</span></p>
                    <p>Copie el código de recuperación, regrese a la vista de recuperación de cuenta e ingréselo. Una vez hecho eso, será dirigido a la zona de cambio de contraseña.</p>
                    <p>Si no ha solicitado este cambio, por favor ignore este mensaje.</p>
                    <p>Agradecemos su atención y quedamos a su disposición para cualquier consulta adicional.</p>
                    <div class="footer">
                        <p>Saludos cordiales,</p>
                        <p>Taskify,<br><span class="recovery-code">Gestor de tareas</span></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            const email = new EmailHandler(user.email, subject, message);
            // send the message...
            await email.emailSending();

            // format the email to display it in safe mode...
            const formattedEmail = secureEmailtoShow(user.email);

            /**
             * we check what was the type of answer, if it was 1 a diferent mesage is assigned to
             * the one that could be if we get a string...
            */
            const ms = formattedEmail === 1
                ? `${user.user_name}, se le ha enviado un código de recuperación a su email registrado.`
                : `${user.user_name}, se le ha mandado a su correo ${formattedEmail} un código de verificación.`;

            // return the message...
            return ms;

        } catch (error) {
            logging.error(`Error: ${error.message}`);
            throw new Error(`Error: ${error.message}`);
        }
    } catch (error) {
        logging.error(`Error: ${error.message}`);
        throw new Error(`Error: ${error.message}`);
    }
}

/**
 * @method PUT
 *
 * Password reset service...
 *
 * @param { Token, newPassword }
 */
const resetForgotenPassword = async (token, newPass) => {
    try {
        // decode the token...
        const decoded = extractUserInfo(token, id_user);

        if(decoded === null){
            logging.warning('Token expirado o usuario incorrecto')
            return 400;
        }

        // extract the id...
        const id = decoded;
        // process the new password...
        const hashedPassword = await bcrypt.hash(newPass, 10);

        // update the password in the database...
        await prisma.users.update({
            where: { id_user: id },
            data: { password: hashedPassword }
        });

        // mark token as expired when setting inmediate expiration...
        jwt.sign(
            { id_user: id},
            SERVER.JWT_KEY,
            { expiresIn: '1S' }
        );

        return 'Su contraseña a sido actualizada correctamente.'

    } catch (error) {
        logging.error(`Error: ${error.message}`);
        throw new Error(`Error: ${error.message}`);
    }
}

export {
    getUsers,
    newUserRegister,
    login,
    logout,
    deleteRefreshToken,
    refreshToken,
    recoverdPassword,
    resetForgotenPassword
};