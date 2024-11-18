import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private logger: winston.Logger;

  constructor() {
    super();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
      ],
    });
  }

  log(message: string) {
    super.log(message); // ConsoleLogger'dan loglama
    this.logger.info(message); // Winston loglama
  }

  error(message: string, trace: string) {
    super.error(message, trace); // ConsoleLogger'dan loglama
    this.logger.error(`${message} - ${trace}`); // Winston loglama
  }

  warn(message: string) {
    super.warn(message); // ConsoleLogger'dan loglama
    this.logger.warn(message); // Winston loglama
  }

  debug(message: string) {
    super.debug(message); // ConsoleLogger'dan loglama
    this.logger.debug(message); // Winston loglama
  }

  verbose(message: string) {
    super.verbose(message); // ConsoleLogger'dan loglama
    this.logger.verbose(message); // Winston loglama
  }
}
