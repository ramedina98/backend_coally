/**
 * En este archivo se tienen todos los controllers necesarios para el funcionamiento del
 * modulo de autenticación...
 */
import {
    getUsers,
    newUserRegister,
    login,
    logout,
    deleteRefreshToken,
    recoverdPassword,
    resetForgotenPassword
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

/**
 * @method POST
 *
 * This controller hendle the process of create a new access token using the
 * refresh token to validate the user...
 */
const refreshTokenController = async (req, res) => {
    const reToken = req.cookies.refreshToken;

    // check if the token has been providing...
    if(!reToken) return res.status(401).json({ message: 'Token no provided.' });

    try {
        // start the process of the new access token...
        const result = await refreshToken(reToken);

        if(typeof result === 'number'){
            let message = '';

            if(result === 404){
                message = 'El token no es valido o ha sido revocado.';
            } else if(result === 403){
                message = 'Error decoding the JWT.';
            }

            return res.status(result).json({ message });
        }

        return res.status(201).json({
            message: 'Token creado con exito.',
            token: result
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
 * This controller handles the process of send an email with a token to recover the password forgoten...
 */
const recoverdPasswordController = async (req, res) => {
    // decunstructing the req.body to retrieve the user_name...
    const { user_name } = req.body;

    if(!user_name){
        return res.status(404).json({
            message: 'Data no provied.'
        });
    }

    try {
        const result = await recoverdPassword(user_name);

        if(result === 422){
            return res.status(result).json({
                message: `El usuario "${user_name}" no fu encontrado.`
            });
        }

        return res.status(200).json({
            message: result
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

/**
 * @method PUT
 *
 * This controller handle the process of reset a forgoten password...
 *
 * @param req.body
 * @returns res.json()
 */
const resetForgotenPasswordController = async (req, res) => {
    // deconstruting the req.body to retrieve the token and the new Password...
    const { token, newPass } = req.body;

    if(!token || !newPass){
        return res.status(404).json({
            message: 'Token or password not provied.',
            token,
            newPass
        });
    }

    try {
        const result = await resetForgotenPassword(token, newPass);

        if(result === 400){
            return res.status(400).json({
                message: 'Token expirado o usuario incorrecto'
            });
        }

        return res.status(200).json({
            message: result
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

export {
    getUsersController,
    newUserRegisterController,
    loginController,
    logoutController,
    refreshTokenController,
    recoverdPasswordController,
    resetForgotenPasswordController
};