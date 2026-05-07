const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit'); // Import the helper
const logger = require('../utils/logger');

// Simple memory-based rate limiter (no Redis required)
const basicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise IP with IPv6 subnet masking
        if (req.user?.id) {
            return req.user.id;
        }
        // FIXED: Use ipKeyGenerator for proper IPv6 subnet handling
        return ipKeyGenerator(req.ip);
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/health/live';
    },
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.',
        });
    },
});

// Strict limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per hour
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 1 hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip), // FIXED: Use ipKeyGenerator
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Very strict limiter for password reset
const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per hour
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again after 1 hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip), // FIXED: Use ipKeyGenerator
});

// API limiter for regular API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise IP with subnet masking
        if (req.user?.id) {
            return req.user.id;
        }
        return ipKeyGenerator(req.ip); // FIXED: Use ipKeyGenerator
    },
});

// Alternative: Custom subnet size for IPv6 (if you need different grouping)
const customSubnetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => {
        if (req.user?.id) return req.user.id;
        return ipKeyGenerator(req.ip, 64);
    },
});

module.exports = {
    basicLimiter,
    authLimiter,
    resetPasswordLimiter,
    apiLimiter,
    customSubnetLimiter,
};