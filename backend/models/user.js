import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Your name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Set the minimum length constraint
        maxlength: 255, // Set a more reasonable maximum length constraint
        select: false, // This is based on your original schema where you were using select("+password")
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
    {
        timestamps: true
    }
);

// Encrypting password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//  Return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

// Compare user password
const isEmpty = (value) => value === undefined || value === null || value === '';

userSchema.methods.comparePassword = async function (enterPassword) {
    try {
        // Ensure both passwords are defined and not empty strings
        if (isEmpty(this.password) || isEmpty(enterPassword)) {
            console.error('Invalid password or undefined value during comparison:', this.password, enterPassword);
            return false;
        }

        const isMatch = await bcrypt.compare(enterPassword, this.password);
        console.log('Password Comparison Result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error during password comparison:', error.message);
        throw new Error('Error during password comparison. Please try again.'); // Rethrow the error with a more user-friendly message
    }
};



// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Add parentheses to Date.now()
    return resetToken;
};
export default mongoose.model("user", userSchema);