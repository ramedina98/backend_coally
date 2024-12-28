/**
 * En este archivo se tienen todos los controllers necesarios para el funcionamiento del
 * modulo de autenticación...
 */
import {
    getUsers,
    newUserRegister,
    login,
    logout
} from "../services/authServices.js";

/**
 * @method GET
 */
const getUsersController = async (req, res) => {
    try {
        const response = await getUsers();

        if(response === 404){
            return res.status(404).json({
                data: []
            });
        }

        return res.status(200).json({
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

/**
 * @method POST
 *
 * This controller handle the process of register a new user...
 */
const newUserRegisterController = async (req, res) => {
    const {user_data} = req.body;

    if(!user_data){
        return res.status(400).json({
            message: 'Datos no proporcionados.'
        });
    }

    try {
        const response = await newUserRegister(user_data);

        if(response === 400){
            return res.status(400).json({
                message: 'Faltan campos obligatorios.'
            });
        }

        return res.status(201).json({
            message: response
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

/**
 * @method POST
 *login controller...
 */
const loginController = async (req, res) => {
    const {username, password} = req.body;

    if(!username || username === ""){
        return res.status(400).json({
            message: 'Usuario no proporcionado.'
        })
    }

    if(!password || password === ""){
        return res.status(400).json({
            message: 'Contraseña no proporcionado.'
        })
    }

    try {
        const response = await login(username, password);

        if(response === 404){
            return res.status(404).json({
                message: 'User name incorrecto.'
            })
        } else if(response === 401){
            return res.status(401).json({
                message: 'Contraseña incorrecto.'
            })
        }

        res.cookie('refreshToken', response.refresh_tokens, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        return res.status(201).json({
            message: `Bienvenido de vuelta ${username}`,
            accessToken: response.accessToken,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

/**
 * @method POST
 *
 * This controller handle the insertion of tokens into the revokd_tokens table and the
 * logout...
 */
const logoutController = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const reToken = req.cookies.refreshToken;

    if(token === undefined){
        return res.status(401).json({
            message: 'Token no provied.'
        });
    }

    if(!reToken){
        return res.status(404).json({ message: 'Refresh token not provided.'});
    }

    try {
        // logout service...
        const result = await logout(token);
        // delete the refresh token from the refresh_tokens table...
        await deleteRefreshToken(reToken);

        if(result === 400){
            return res.status(result).json({
                error: 'Token expirado o incorrecto.'
            });
        }

        // clean the cooki of refresh token...
        res.clearCookie('refreshToken');
        res.status(result).json({
            message: 'Cerrando sesión.'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

export { getUsersController, newUserRegisterController, loginController, logoutController };