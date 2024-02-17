"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpRequestModel = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otp_token: {
        type: String,
        required: true,
    },
    expire_at: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("otpRequestModel", otpRequestModel);
