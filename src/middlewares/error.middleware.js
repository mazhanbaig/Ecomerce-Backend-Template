const ResponseObj = require("../utils/ResponseObj");

// 404 handler
const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json(ResponseObj(false, err.message, null,
        process.env.NODE_ENV === "development" ? err.stack : null
    ));
};

module.exports = { notFound, errorHandler };