import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { LoggingWinston } from '@google-cloud/logging-winston';

const keyFilePath = path.join(__dirname, 'google-credentials.json');
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    fs.writeFileSync(keyFilePath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
} else {
    console.error('GOOGLE_APPLICATION_CREDENTIALS_JSON not defined !');
}

const loggingWinston = new LoggingWinston({
  projectId: 'soy-sunrise-447921-v4',
  keyFilename: keyFilePath
});

const log = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
    loggingWinston
  ],
});

export default log;
