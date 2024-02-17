"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNewPassword = exports.resetPassword = void 0;
const userDetailsModel_1 = __importDefault(require("../models/userDetailsModel"));
const utils_1 = require("../utils/utils");
const constants_1 = require("../constants/constants");
const otpRequestModel_1 = __importDefault(require("../models/otpRequestModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../utils/logger"));
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.validateRequestParams)(req, res);
    const { email } = req.body;
    logger_1.default.log("resetPassword - started :", req.body);
    const user = yield userDetailsModel_1.default.findOne({ email });
    const transporter = yield (0, utils_1.prepareTransportorEmail)();
    if (user) {
        if (transporter) {
            const mailOptions = {
                from: process.env.GMAIL_ID,
                to: process.env.GMAIL_ID,
                subject: "[Todo App] OTP request for Reset Password",
                html: `<h1 style="text-align:center">OTP Request</h1><p style="text-align:center">Hello</p><p style="text-align:center">Please use following OTP to reset your password. This OTP will expire within ${process.env.OTPEXPIRYINMINUTES}min.</p><div style="text-align:center; height:40px;width:100px;border-radius:5px;background-color: black;text-align: center;line-height: 40px;margin: auto;margin-top:40px"><h2 style="color:white">19374</h2></div>`,
            };
            transporter
                .sendMail(mailOptions)
                .then(() => {
                const otp = Math.floor(1000 + Math.random() * 8999);
                const getTenMinutesAfterTime = (0, utils_1.addMinutesToCurrentUtc)(10);
                otpRequestModel_1.default
                    .findOneAndUpdate({ email }, {
                    $set: {
                        email,
                        otp,
                        otp_token: new Date().getTime(),
                        expire_at: getTenMinutesAfterTime,
                    },
                }, { new: true, upsert: true })
                    .then((data) => {
                    const { code, message } = constants_1.responseCodes.SUCCESS;
                    res.json((0, utils_1.formatResponse)({ code, message, data }));
                })
                    .catch((err) => {
                    const { code } = constants_1.responseCodes.ERROR;
                    res.json((0, utils_1.formatResponse)({ code, message: err }));
                });
            })
                .catch((error) => {
                const { code, message } = constants_1.responseCodes.ERROR;
                res.json((0, utils_1.formatResponse)({ code, message, data: error }));
            });
        }
    }
    else {
        const { code, message } = constants_1.responseCodes.NORECORDSFOUND;
        res.json((0, utils_1.formatResponse)({ code, message }));
    }
});
exports.resetPassword = resetPassword;
const updateNewPassword = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { email, otp_token, otp, newPassword } = req.body;
    logger_1.default.log("updateNewPassword - started :", req.body);
    otpRequestModel_1.default
        .findOne({
        email,
        otp_token,
        otp,
        expire_at: { $gte: (0, utils_1.currentUtcTime)() },
    })
        .then((result) => {
        if (result) {
            bcryptjs_1.default.hash(newPassword, constants_1.SALTCODE, (err, hashedPass) => {
                userDetailsModel_1.default
                    .findOneAndUpdate({ email }, { $set: { password: hashedPass } }, { new: true })
                    .then((data) => {
                    if (data) {
                        const { code, message } = constants_1.responseCodes.SUCCESS;
                        res.json((0, utils_1.formatResponse)({ code, message, data }));
                    }
                    else {
                        const { code, message } = constants_1.responseCodes.NORECORDSFOUND;
                        res.json((0, utils_1.formatResponse)({ code, message }));
                    }
                });
            });
        }
        else {
            const { code } = constants_1.responseCodes.NORECORDSFOUND;
            res.json((0, utils_1.formatResponse)({ code, message: "OTP expired" }));
        }
    })
        .catch((error) => {
        const { message, code } = constants_1.responseCodes.ERROR;
        res.json((0, utils_1.formatResponse)({
            code,
            message,
            data: error,
        }));
    });
};
exports.updateNewPassword = updateNewPassword;
