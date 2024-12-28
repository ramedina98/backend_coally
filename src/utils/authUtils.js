import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import { SERVER } from "../config/config.js";

// this function helps me creating jwt's...
const token = (user, duration_time) => {
    return jwt.sign(
        {
            id_user: user.id_user,
            user_name: user.user_name,
            nombre: user.nombre1,
            apellido: user.apellido1,
            email: user.email
        },
        SERVER.JWT_KEY,
        { expiresIn: duration_time }
    );
}

// refresh token...
const generateRefreshToken = async (user) => {
    const refreshToken = token(user, SERVER.JWT_RE_TIME);

    // store the refresh token...
    await prisma.refresh_tokens.create({
        data: {
            id_user: user.id_user,
            token: refreshToken
        }
    });

    return refreshToken;
}

const recoveryToken = (id) => {
    return jwt.sign(
        {
            id_user: id
        },
        SERVER.JWT_KEY,
        { expiresIn: '2m' }
    );
}

const extractUserInfo = (token, field) => {
    try {
        // verify and decode the token...
        const decoded = jwt.verify(token, SERVER.JWT_KEY);

        // return the required data...
        return decoded[field] || null;
    } catch (error) {
        console.log(`Error al decodificar el token: ${error.message}`)
        return null;
    }
}

const extractAllUserInfo = (token) => {
    try {
        // verify and decode the token...
        const decoded = jwt.verify(token, SERVER.JWT_KEY);

        // return the required data...
        return decoded;
    } catch (error) {
        console.log(`Error al decodificar el token: ${error.message}`)
        return null;
    }
}

export {
    token,
    generateRefreshToken,
    recoveryToken,
    extractUserInfo,
    extractAllUserInfo
};