import mongoose from "mongoose";
import { SERVER } from "../config/config.js";
import logging from "../config/logging.js";

const connectDB = async () => {
    try {
        await mongoose.connect(SERVER.URI);
        logging.info('----------------------------------------------');
        logging.info('Connect to Mongodb');
        logging.info('----------------------------------------------');
    } catch (error) {
        logging.error('Mongodb connection error: ' + error.message);
        process.exit(1);
    }
}

export default connectDB;