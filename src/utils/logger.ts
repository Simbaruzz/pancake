import fs from 'fs';
import path from 'path';
import winston, { Logger as WinstonLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import appData from './appData.js';

class Logger {
  /**
   * Directory where logs are stored.
   */
  private logsDirPath: string;

  constructor() {
    // Logs will be stored in the `app-data/logs` directory
    this.logsDirPath = path.join(appData.logsDir);

    if (!fs.existsSync(this.logsDirPath)) {
      fs.mkdirSync(this.logsDirPath, { recursive: true });
    }
  }

  /**
   * Creates and returns a Winston logger instance with the configured transports and format.
   * @returns An object with logging methods (log, debug, info, warn, error).
   */
  getLogger(): {
    log: Function;
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
  } {
    const logger: WinstonLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.combine(
        winston.format.errors({ stack: true }), // Format for errors with stack traces
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf((info) => {
          return (
            `${info.timestamp} [${info.level}] ${info.message}` +
            (info.splat !== undefined ? `${info.splat}` : ' ') +
            (info.stack !== undefined ? `\n${info.stack}` : '')
          );
        })
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          dirname: this.logsDirPath,
          filename: '%DATE%.log',
        }),
      ],
    });

    return {
      log: logger.debug.bind(logger),
      debug: logger.debug.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
      error: logger.error.bind(logger),
    };
  }
}

/**
 * Singleton instance of the Logger class.
 */
const loggerInstance = new Logger();
const logger = loggerInstance.getLogger();

export default logger;
