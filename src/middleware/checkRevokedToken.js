import { SERVER } from "../config/config.js";
import prisma from "../config/prismaClient.js";
import logging from "../config/logging.js";
import jwt from "jsonwebtoken";

const checkIfTokenIsRevoked = async (token) => {
    const revokedToken = await prisma.revoked_tokens.findFirst({
        where: { token },
    });

    // returns true if token has been revoked, false otherwise...
    return revokedToken !== null;
}

const checkRevokedToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logging.error('No token provided.');
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        // Verificar si el token está en la tabla de tokens revocados...
        const isRevoked = await checkIfTokenIsRevoked(token);
        if (isRevoked) {
            logging.warning('Sesión expirada.');
            res.status(403).json({ message: 'Sesión expirada.' });
            return;
        }

        // Decodificar el token para obtener la información del usuario...
        const decoded = jwt.verify(token, SERVER.JWT_KEY);
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logging.warning('Sesión expirada.');
            return res.status(401).json({ message: 'Sesión expirada.' });
        } else if (error.name === 'JsonWebTokenError') {
            // Si el token es inválido o mal formado
            logging.error('Token inválido.');
            return res.status(403).json({ message: 'Token inválido.' });
        } else {
            // Manejo de cualquier otro error desconocido
            logging.error('Error al verificar el token:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default checkRevokedToken;