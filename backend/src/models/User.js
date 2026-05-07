const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please add a valid email address',
        ],
        validate: {
            validator: function (v) {
                // Additional email validation - no consecutive dots, proper format
                return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(v);
            },
            message: 'Please add a valid email address',
        },
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
        validate: {
            validator: function (v) {
                // Password must contain at least:
                // - 1 uppercase letter
                // - 1 lowercase letter  
                // - 1 number
                // - 1 special character
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(v);
            },
            message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character (@$!%*?&)',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if password meets requirements (for additional validation)
UserSchema.statics.isPasswordStrong = function (password) {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[@$!%*?&]/.test(password),
    };

    const isValid = Object.values(requirements).every(Boolean);

    return {
        isValid,
        requirements,
    };
};

// Method to sanitize user object (remove sensitive data)
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    return user;
};

module.exports = mongoose.model('User', UserSchema);