export const loggingHandler = (req, res, next) => {
    logging.log(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.address}]`);

    res.on('finish', () => {
        logging.log(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.address}] - STATUS [${res.statusCode}]`);
    });

    next();
};