var winston = require('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'logs/info.log',
            level: 'info',
            json:false
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'logs/error.log',
            level: 'error',
            json:false
        }),
        new winston.transports.File({
            name: 'exception-file',
            filename: 'logs/exception.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            level: 'exception',
            json:false
        }),
        new winston.transports.Console({
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        })
    ]
});