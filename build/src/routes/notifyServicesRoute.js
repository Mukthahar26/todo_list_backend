"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paramValidation_1 = require("./paramValidation");
const notifyServicesController_1 = require("../controllers/notifyServicesController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const notifyServicesRouter = (0, express_1.Router)();
notifyServicesRouter.use((req, res, next) => {
    const jwt_token = req.headers.authorization;
    if (!jwt_token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
    try {
        const userData = jsonwebtoken_1.default.verify(jwt_token, "secret");
        req["userDetails"] = userData;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
});
notifyServicesRouter.post("/restpassword", paramValidation_1.resetPaswordParam, notifyServicesController_1.resetPassword);
notifyServicesRouter.post("/updateNewPassword", paramValidation_1.updateNewPasswordParams, notifyServicesController_1.updateNewPassword);
exports.default = notifyServicesRouter;
