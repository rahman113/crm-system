const morgan = require('morgan');
const logger = require('../utils/logger');
morgan.token('response-time-ms', (req, res) => {
    if (!res._header || !req._startAt) return '';
    const diff = process.hrtime(req._startAt);
    const ms = diff[0] * 1e3 + diff[1] / 1e6;
    return Math.round(ms);
});

morgan.token('user-id', (req) => {
    return req.user?.id || 'anonymous';
});
morgan.token('body', (req) => {
    if (process.env.NODE_ENV === 'development' && req.body && Object.keys(req.body).length) {
        const { password, ...safeBody } = req.body;
        return JSON.stringify(safeBody);
    }
    return '';
});
const devFormat = ':method :url :status :response-time-ms ms - :user-id - :body';
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time-ms ms - :user-id';

const combinedFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-ms ms';
const morganLogger = morgan((tokens, req, res) => {
    const logData = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        responseTime: `${tokens['response-time-ms'](req, res)} ms`,
        userId: tokens['user-id'](req, res),
        userAgent: tokens['user-agent'](req, res),
        ip: tokens['remote-addr'](req, res),
        contentLength: tokens.res(req, res, 'content-length'),
        timestamp: new Date().toISOString(),
    };

    // Log to Winston
    if (process.env.NODE_ENV === 'development') {
        logger.info(`${logData.method} ${logData.url}`, logData);
    } else {
        logger.http(`${logData.method} ${logData.url}`, logData);
    }
    return process.env.NODE_ENV === 'development' ? devFormat : combinedFormat;
}, {
    stream: logger.stream,
    skip: (req) => {
        if (process.env.NODE_ENV === 'production') {
            return req.path === '/health' || req.path === '/health/live';
        }
        return false;
    },
});

module.exports = morganLogger;