import ErrorHandler from "../utils/ErrorHandler.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server error",
    };

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack
        });
    }

    // Handle Invalid Mongoose ID error
    if (err.name === 'CastError') {
        const message = `Resource not found: ${err?.path}`;
        error = new ErrorHandler(message, 404);
    }

    // Handle Validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        res.status(error.statusCode).json({
            message: error.message
        });
    }
};
