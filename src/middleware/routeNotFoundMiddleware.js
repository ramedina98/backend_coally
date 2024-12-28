export const routeNotFound = (_req, res, _next) => {
    const error = new Error('Route not found');

    logging.error(error);

    return res.status(404).json({ error: error.message });
};