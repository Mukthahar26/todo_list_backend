"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paramValidation_1 = require("./paramValidation");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
router
    .use((_, __, next) => {
    next();
})
    .post("/registration", paramValidation_1.registrationParams, userControllers_1.registrationController)
    .get("/login", paramValidation_1.loginParams, userControllers_1.loginController)
    .put("/updateUserDetails", paramValidation_1.updateUserParams, userControllers_1.updateUserDetails)
    .post("/refreshToken", paramValidation_1.refreshTokenParams, userControllers_1.deleteUser)
    .delete("/deleteuser", paramValidation_1.deleteUserParams, userControllers_1.deleteUser)
    .get("/testing", userControllers_1.testingAPI)
    .get("/tester", paramValidation_1.userpram, userControllers_1.testingAPIParam);
exports.default = router;
