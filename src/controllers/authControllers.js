/**
 * En este archivo se tienen todos los controllers necesarios para el funcionamiento del
 * modulo de autenticación...
 */
import {
    getUsers
} from "../services/authServices.js";

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

export { getUsersController };