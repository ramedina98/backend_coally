/**
 * Este archivo contiene todos los controladores necesarios para gestionar
 * el correcto funcionamiento del modulo user...
 */
import {
    getUserInfo,
    updateUserInfo,
    updateUserPassword
} from "../services/userServices.js";

/**
 * @method GET
 *
 * Controller to retrieve the user data...
 */
const getUserInfoController = async (req, res) => {
    const id = req.user.id_user;

    console.log(id)

    try {
        const user_data = await getUserInfo(id);

        if(user_data === 404){
            return res.status(404).json({
                message: 'No se encontro al usuario.'
            });
        }

        return res.status(200).json({
            message: 'Datos encontrados.',
            data: user_data
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
 * Controller for update the user info...
 */
const updateUserInfoController = async (req, res) => {
    const id = req.user.id_user;
    const dataUser = req.body;

    if(!dataUser){
        return res.status(400).json({
            message: 'No se proporcionaron datos para actualizar.'
        });
    }

    try {
        const data = await updateUserInfo(id, dataUser);

        return res.status(200).json({
            message: 'Datos actualizados',
            data
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

/**
 * @method PATCH
 *
 * Controller for update the password...
 */
const updateUserPasswordController = async (req, res) => {
    const id = req.user.id_user;
    const { data } = req.body;

    if(!data){
        return res.status(400).json({
            message: 'Datos no proporcionados.'
        });
    }

    try {
        const data = await updateUserPassword(id, data);

        if(data === 404){
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            })
        } else if(data === 401){
            return res.status(401).json({
                message: 'Contraseña incorrecta.'
            })
        }

        return res.status(200).json({
            message: data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong while creating the task'
        });
    }
}

export {
    getUserInfoController,
    updateUserInfoController,
    updateUserPasswordController
}