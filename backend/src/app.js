const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import logger and rate limiters
const logger = require('./utils/logger');
const morganLogger = require('./middleware/morganLogger');
const {
    basicLimiter,
    authLimiter,
    apiLimiter,
    resetPasswordLimiter,
} = require('./middleware/rateLimiter');

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware - log all HTTP requests
app.use(morganLogger);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(basicLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', resetPasswordLimiter);
app.use('/api/auth/reset-password', resetPasswordLimiter);

app.use('/api/auth', authLimiter);

app.use('/api/leads', apiLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
    logger.warn(`404 Not Found: ${req.originalUrl} - IP: ${req.ip} - Method: ${req.method}`);
    res.status(404).json({
        success: false,
        message: `Cannot find ${req.originalUrl} on this server`,
    });
});

app.use(errorMiddleware);

logger.info('Application middleware initialized', {
    environment: process.env.NODE_ENV,
    corsEnabled: true,
    rateLimitingEnabled: true,
    loggingEnabled: true,
});

module.exports = app;