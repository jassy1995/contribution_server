import winston from 'winston';

const localFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const transports: winston.transport[] = [new winston.transports.Console({ format: localFormat })];

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.json(),
  transports,
});

export default logger;
