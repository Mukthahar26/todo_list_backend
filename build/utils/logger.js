"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const utils_1 = require("./utils");
const { createLogger, format, transports } = winston_1.default;
const logFormat = format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [
        new transports.File({
            filename: `logs/-${(0, utils_1.currentUtcTime)("YYYY-MM-DD")}.log`,
            level: "error",
            format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
        }),
        new transports.File({
            filename: `logs/logger-${(0, utils_1.currentUtcTime)("YYYY-MM-DD")}.log`,
            format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
        }),
    ],
});
exports.default = logger;
