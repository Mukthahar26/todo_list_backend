"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUtcTime = exports.addMinutesToCurrentUtc = exports.prepareTransportorEmail = exports.isDateUtc = exports.validateRequestParams = exports.formatResponse = exports.isKeyEmpty = exports.getLastEndpoint = void 0;
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const dayjs_1 = __importDefault(require("dayjs"));
dayjs_1.default.extend(utc_1.default);
const getLastEndpoint = (str) => str && str.split("/")[str.length - 1];
exports.getLastEndpoint = getLastEndpoint;
const isKeyEmpty = (str) => str && str.trim().length > 0;
exports.isKeyEmpty = isKeyEmpty;
const formatResponse = ({ code = "00", message = "Success", data = null, }) => {
    return {
        code,
        message,
        data,
    };
};
exports.formatResponse = formatResponse;
const validateRequestParams = (request, response) => {
    const errorList = (0, express_validator_1.validationResult)(request);
    if (!errorList.isEmpty()) {
        response.status(400).json({
            message: "Request param Validation errors",
            errors: errorList.array(),
        });
    }
};
exports.validateRequestParams = validateRequestParams;
const isDateUtc = (date) => date && dayjs_1.default.utc(date).isUTC();
exports.isDateUtc = isDateUtc;
const prepareTransportorEmail = () => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.APP_PASSCODE,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    return new Promise((resolve, reject) => {
        transporter
            .verify()
            .then(() => {
            resolve(transporter);
            console.log("Transporter is ready");
        })
            .catch((error) => {
            reject(false);
            console.error("Error verifying transporter:", error);
        });
    });
};
exports.prepareTransportorEmail = prepareTransportorEmail;
const addMinutesToCurrentUtc = (minutes) => minutes &&
    (0, dayjs_1.default)().add(minutes, "minute").utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
exports.addMinutesToCurrentUtc = addMinutesToCurrentUtc;
const currentUtcTime = (format = "YYYY-MM-DDTHH:mm:ss[Z]") => (0, dayjs_1.default)().utc().format(format);
exports.currentUtcTime = currentUtcTime;
