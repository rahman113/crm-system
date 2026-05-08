const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Import logger
const logger = require('./src/utils/logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logger.info(`Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    logger.error('Unhandled Rejection', {
        error: err.message,
        stack: err.stack,
        promise: promise,
    });
    // Gracefully shutdown
    server.close(() => {
        logger.info('Server closed due to unhandled rejection');
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    logger.error('Uncaught Exception', {
        error: err.message,
        stack: err.stack,
    });
    // Gracefully shutdown
    server.close(() => {
        logger.info('Server closed due to uncaught exception');
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
            logger.info('Database connection closed');
            process.exit(0);
        });
    });
});
process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
            logger.info('Database connection closed');
            process.exit(0);
        });
    });
});
server.on('close', () => {
    logger.info('Server closing...');
});

// Log any server errors
server.on('error', (error) => {
    logger.error('Server error', {
        error: error.message,
        code: error.code,
    });
});