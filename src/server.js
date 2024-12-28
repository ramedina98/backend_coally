import app from "./app.js";
import { SERVER } from "./config/config.js";
import logging from "./config/logging.js";

const PORT =  process.env.PORT || SERVER.SERVER_PORT;

app.listen(PORT, "0.0.0.0", () => {
    logging.info('----------------------------------------------');
    logging.info(`Server running on port http://localhost:${PORT}`);
    logging.info('----------------------------------------------');
});