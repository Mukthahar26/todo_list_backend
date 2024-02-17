"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenParams = exports.updateNewPasswordParams = exports.otpRequestParam = exports.resetPaswordParam = exports.deleteUserParams = exports.markAsCompletedParams = exports.updateTodoListParams = exports.getTodoListParams = exports.createTodoListParams = exports.userpram = exports.updateUserParams = exports.loginParams = exports.registrationParams = void 0;
const express_validator_1 = require("express-validator");
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils/utils");
const constants_1 = require("../constants/constants");
const logger_1 = __importDefault(require("../utils/logger"));
exports.registrationParams = [
    (0, express_validator_1.body)("fullName").notEmpty().notEmpty().isString(),
    (0, express_validator_1.body)("email").isEmail().notEmpty(),
    (0, express_validator_1.body)("password").notEmpty().isString(),
    (0, express_validator_1.body)("mobileNo").notEmpty().isString(),
];
const loginParams = (req, res, next) => {
    const schemas = joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    const data = schemas.validate(req.body);
    const { error } = data;
    logger_1.default.log("data :", data);
    if (error) {
        const { code, message } = constants_1.responseCodes.ERROR;
        res.status(400).json((0, utils_1.formatResponse)({ code, message, data: error }));
    }
    {
        next();
    }
};
exports.loginParams = loginParams;
exports.updateUserParams = [
    (0, express_validator_1.body)("fullName").notEmpty().notEmpty().isString(),
    (0, express_validator_1.body)("email").isEmail().notEmpty(),
    (0, express_validator_1.body)("mobileNo").notEmpty().isString(),
    (0, express_validator_1.body)("id").notEmpty().isString(),
];
exports.userpram = [(0, express_validator_1.body)("user").notEmpty().isString()];
exports.createTodoListParams = [
    (0, express_validator_1.body)("user_id").notEmpty().isString(),
    (0, express_validator_1.body)("title").notEmpty().isString(),
    (0, express_validator_1.body)("desc").notEmpty().isString(),
    (0, express_validator_1.body)("priority").notEmpty().isString(),
    (0, express_validator_1.body)("end_at").notEmpty().isString(),
];
exports.getTodoListParams = [
    (0, express_validator_1.body)("user_id").notEmpty().isString(),
    (0, express_validator_1.body)("offset").optional().isInt(),
    (0, express_validator_1.body)("filter.status")
        .optional()
        .isIn(["Pending", "Completed"])
        .withMessage("Invalid status keyword"),
    (0, express_validator_1.body)("filter.priority")
        .optional()
        .isIn(["Low", "Medium", "High"])
        .withMessage("Invalid priority keyword"),
    (0, express_validator_1.body)("sort")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Invalid sort order"),
];
exports.updateTodoListParams = [
    (0, express_validator_1.body)("user_id").notEmpty().isString(),
    (0, express_validator_1.body)("todolistid").notEmpty().isString(),
    (0, express_validator_1.body)("title").optional().isString(),
    (0, express_validator_1.body)("desc").optional().isString(),
    (0, express_validator_1.body)("priority").optional().isString(),
    (0, express_validator_1.body)("end_at").optional().isString(),
    (0, express_validator_1.body)("filter.priority")
        .optional()
        .isIn(["Low", "Medium", "High"])
        .withMessage("Invalid priority keyword"),
    (0, express_validator_1.body)("filter.status")
        .optional()
        .isIn(["Pending", "Completed"])
        .withMessage("Invalid status keyword"),
];
exports.markAsCompletedParams = [
    (0, express_validator_1.body)("user_id").notEmpty().isString(),
    (0, express_validator_1.body)("todolistid").notEmpty().isString(),
];
exports.deleteUserParams = [
    (0, express_validator_1.body)("user_id").notEmpty().isString(),
    (0, express_validator_1.body)("email").notEmpty().isString(),
];
exports.resetPaswordParam = [(0, express_validator_1.body)("email").notEmpty().isString()];
exports.otpRequestParam = [(0, express_validator_1.body)("email").notEmpty().isString()];
exports.updateNewPasswordParams = [
    (0, express_validator_1.body)("email").notEmpty().isString(),
    (0, express_validator_1.body)("otp_token").notEmpty().isString(),
    (0, express_validator_1.body)("otp").notEmpty().isString(),
    (0, express_validator_1.body)("newPassword").notEmpty().isString(),
];
exports.refreshTokenParams = [(0, express_validator_1.body)("refreshToken").notEmpty().isString()];
