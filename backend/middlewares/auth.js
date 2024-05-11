import jwt from 'jsonwebtoken';
import catchAsyncErrors from './catchAsyncErrors.js';
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/user.js";

// Check if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorHandler("User not found, please log in again", 401));
        }

        req.user = user; // Set the user in the request object
        console.log(decoded);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token, please log in again", 401));
    }
});

// Authorize user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    }
};
