//https://stackoverflow.com/questions/49271570/winston-attempt-to-write-logs-with-no-transports
const {
    createLogger,
    transports,
    format
} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: {
        service: 'user-service'
    },
    timestamp: true,
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({
            filename: 'log-error.log',
            level: 'error'
        }),
        new transports.File({
            filename: 'log-combined.log'
        })
    ],
    exceptionHandlers: [
        new transports.File({
            filename: 'log-exceptions.log'
        })
    ]
});

logger.exceptions.handle(
  new transports.File({ filename: 'log-exceptions.log' })
);

logger.add(new transports.Console({
    format: format.simple(),
    timestamp: true
}));


module.exports = logger;

// module.exports = {
//     errorLog: errorLog,
//     accessLog: accessLog
// };
