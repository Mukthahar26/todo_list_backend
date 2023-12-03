import winston from "winston";
import { currentUtcTime } from "./utils";
const { createLogger, format, transports } = winston;

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: `logs/-${currentUtcTime("YYYY-MM-DD")}.log`,
      level: "error",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
    new transports.File({
      filename: `logs/logger-${currentUtcTime("YYYY-MM-DD")}.log`,
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

export default logger;
