const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        validate
    ],
    register
);
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
        validate
    ],
    login
);

router.get('/me', protect, getMe);

module.exports = router;