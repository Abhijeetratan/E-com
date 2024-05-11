const catchAsyncErrors = (fn) => {
    // Return a middleware function that ensures the wrapped function returns a Promise
    return (req, res, next) => {
        // Execute the wrapped function and catch any errors
        Promise.resolve(fn(req, res, next)).catch((err) => {
            // Pass the error to Express's error handling middleware
            next(err);
        });
    };
};

export default catchAsyncErrors;
