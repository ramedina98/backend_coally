import { SERVER } from "../config/config.js";
import prisma from "../config/prismaClient.js";
import logging from "../config/logging.js";

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
            // El token ha expirado
            logging.warning('Sesión expirada.');
            res.status(401).json({ message: 'Sesión expirada.' });
        } else {
            logging.error('No token provided.');
            // Cualquier otro error de verificación
            res.status(403).json({ message: 'Invalid token' });
        }
    }
}

export default checkRevokedToken;