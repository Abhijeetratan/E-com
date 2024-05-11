import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from '../models/user.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from 'bcryptjs';
import getResetPasswordTemplate from "../utils/emailTemplates.js";
import {upload_file} from "../utils/cloudinary.js"

export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });
    sendToken(user, 201, res)
});

// login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            throw new ErrorHandler('Please enter email & password', 400);
        }

        // Find user in database
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new ErrorHandler('Invalid email or password', 401);
        }

        // Check if password is correct
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            throw new ErrorHandler('Invalid email or password', 401);
        }

        // Return JWTToken
        sendToken(user, 200, res); // Changed status code to 200 for successful login
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});


// Login user => /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httponly: true,
    });
    res.status(200).json({
        message: "Logged Out",
    })
})

//Upload  user avater => /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    try {
      // Upload avatar
      const avatarResponse = await upload_file(req.body.avatar, "E-COM/avatar");
  
      // Delete previous avatar if exists
      if (req?.user?.avatar?.public_id) {
        await delete_file(req?.user?.avatar?.public_id);
      }
  
      // Update user with new avatar
      const user = await User.findByIdAndUpdate(req?.user?._id, { avatar: avatarResponse }, { new: true });
  
      // Send response
      res.status(200).json({ user });
    } catch (error) {
      // Handle errors
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Forget password => api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find user in the database by email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // If user not found, return 404 error
            return next(new ErrorHandler('User not found with this email', 404));
        }

        // Generate reset password token
        const resetToken = user.getResetPasswordToken();

        // Construct reset password URL
        const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

        // Generate reset password email template
        const template = getResetPasswordTemplate(user.username, resetUrl);

        // Send reset password email
        await sendEmail({
            email: user.email,
            subject: 'E-COM Password Recovery',
            message: template,
        });

        // Update user's reset password token and expiration date in the database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + parseInt(process.env.RESET_PASSWORD_EXPIRES) * 60 * 1000;
        await user.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        // Handle errors
        console.error('Error sending reset password email:', error);
        return next(new ErrorHandler('Failed to send reset email', 500));
    }
});


// Get current user profile => /api/v1/me
export const getUserProfile = (async (req, res, next) => {
    try {
        const user = await User.findById(req?.user?._id);

        if (!user) {
            return next(new ErrorHandler('User profile not found', 404));
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to fetch user profile', 500));
    }
});

// Update Password => /api/v1/password/update

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    // Find the user by ID and select the password field
    const user = await User.findById(req?.user?._id).select("+password");

    // Check if the user exists
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Check if both old and new passwords are provided
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('Old or new password is missing', 400));
    }

    // Check if the provided current password is correct
    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    // Hash the new password before updating
    try {
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.password = newPasswordHash;
    } catch (error) {
        console.error('Error hashing new password:', error);
        return next(new ErrorHandler('Error updating password', 500));
    }

    // Save the user after updating the password
    await user.save();

    // Clear the user's token to force reauthentication after password change
    user.tokens = [];

    // Send response
    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    });
});

// Update User Profile => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    try {
        const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
            new: true,
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user // Send updated user data in the response
        });
    } catch (error) {
        console.error('Error updating profile:', error); // Log the specific error
        return next(new ErrorHandler('Failed to update profile', 500)); // Handle update error
    }
});

//Get all User - Admin => /api/v1/users
export const allUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.find(req.params.id);

    res.status(200).json({
        user,
    })

})


//Get all User - Admin => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with id:${req.params.id}`, 404))
    }
    res.status(200).json({
        user,
    })

})

// Update User Details= ADMIN => /api/v1/admin/user/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role // Assuming the role is passed in the request body as "role"
    };

    try {
        const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
            new: true,
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'User Details updated successfully',
            data: user // Send updated user data in the response
        });
    } catch (error) {
        console.error('Error updating profile:', error); // Log the specific error
        return next(new ErrorHandler('Failed to update profile', 500)); // Handle update error
    }
});


// Delete User Details= ADMIN => /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id); // Removed unnecessary parameters

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    await user.deleteOne(); // Remove the user document

    //  TODO  -Remove user avatar from cloudinaryk

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});
