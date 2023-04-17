const winston = require('winston');
// const { AzureApplicationInsightsLogger } = require('winston-azure-application-insights');
/**
 * Initialize logger for appInsight
 * @param {*} appInsightsClient
 * @returns
 */

function initializeLogger(appInsightsClient) {
    // no using winston.createLogger as configuring the default logger
    // allows us to simply require winston in any other file and use
    // the logger without reconfiguring it
    winston.configure({
        level: process.env.Environment == 'production' ? 'info' : 'debug',
        // format: winston.format.json(),
        // defaultMeta: { service: 'bot-service' },
        transports: [
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                maxsize: 5242880,
                maxFiles: 5
            }),
            new winston.transports.File({
                filename: 'logs/combined.log',
                maxsize: 5242880,
                maxFiles: 5
            })
            // new winston.transports.File({
            //     filename: 'logs/server.log',
            // format: winston.format.combine(
            //     winston.format.timestamp({ format: 'YYYY-DD-MM HH:mm:ss' }),
            //     winston.format.align(),
            //     winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            // )
            // }),
        ],
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-DD-MM HH:mm:ss.SSS' }),
            // winston.format.align(),
            // winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}: ${info.stack}`),
            winston.format.json()
        )
    });
    return winston;
}

module.exports = {
    initializeLogger: initializeLogger
};