/**
 * Here we load all the environment variables that we have,
 * and we do some required configurations...
 */
import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';
export const PRODUCTION = process.env.NODE_ENV === 'production';

export const SERVER = {
    SERVER_PORT:process.env.SERVER_PORT_DEV,
    URI:process.env.MONGO_URI,
    JWT_KEY: process.env.JWT_SECRET_KEY,
    JWT_RE_TIME: process.env.JWT_TIME_REFRESH,
    JWT_TIME: process.env.JWT_TIME_SIGN,
};