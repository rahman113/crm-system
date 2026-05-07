const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse'); // Ensure this exists
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Helper to format response and send token
 */
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check for user and include password field
    const user = await User.findOne({ email }).select('+password');

    // Generic error for both "no user" and "wrong password" (Security best practice)
    if (!user || !(await user.matchPassword(password))) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = catchAsync(async (req, res, next) => {
    // req.user.id comes from the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});