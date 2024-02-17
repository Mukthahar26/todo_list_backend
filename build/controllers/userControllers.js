"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingAPIParam = exports.testingAPI = exports.refreshTokenDetails = exports.deleteUser = exports.updateUserDetails = exports.loginController = exports.registrationController = void 0;
const userDetailsModel_1 = __importDefault(require("../models/userDetailsModel"));
const constants_1 = require("../constants/constants");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const registrationController = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { fullName, email, mobileNo, password, confirmPassword } = req.body;
    logger_1.default.log("registrationController - started :", req.body);
    if (password === confirmPassword) {
        userDetailsModel_1.default
            .findOne({ email })
            .then((data) => {
            logger_1.default.log("registrationController - user data :", data);
            if (data) {
                const { code, message } = constants_1.responseCodes.ALREADYEXIST;
                logger_1.default.log("registrationController - already exist :", code, message);
                res.json((0, utils_1.formatResponse)({ code, message }));
            }
            else {
                bcryptjs_1.default.hash(password, constants_1.SALTCODE, (err, hashedPass) => {
                    if (err) {
                        const { code, message } = constants_1.responseCodes.ERROR;
                        res.json((0, utils_1.formatResponse)({ code, message }));
                    }
                    const userModel = new userDetailsModel_1.default({
                        id: (0, uuid_1.v4)(),
                        fullName,
                        email,
                        mobileNo,
                        password: hashedPass,
                    });
                    userModel
                        .save()
                        .then((data) => {
                        const { code, message } = constants_1.responseCodes.SUCCESS;
                        res.json((0, utils_1.formatResponse)({ code, message, data }));
                    })
                        .catch((err) => {
                        const { code } = constants_1.responseCodes.ERROR;
                        res.json((0, utils_1.formatResponse)({ code, message: err }));
                    });
                });
            }
        })
            .catch((err) => {
            const { code, message } = constants_1.responseCodes.ERROR;
            res.json((0, utils_1.formatResponse)({ code, message, data: err }));
        });
    }
    else {
        const { code, message } = constants_1.responseCodes.PASSWORDNOTMATCHED;
        res.json((0, utils_1.formatResponse)({ code, message }));
    }
};
exports.registrationController = registrationController;
const loginController = (req, res) => {
    const { email, password } = req.body;
    logger_1.default.log("loginController - started :", req.body);
    const notFound = () => {
        const { message, code } = constants_1.responseCodes.NORECORDSFOUND;
        res.json((0, utils_1.formatResponse)({ code, message: `User ${message}` }));
    };
    userDetailsModel_1.default
        .findOne({ email })
        .then((result) => {
        if (result) {
            const _a = result.toObject(), { password: dbPassword } = _a, data = __rest(_a, ["password"]);
            const compare = bcryptjs_1.default.compareSync(password, dbPassword);
            if (compare) {
                let token = jsonwebtoken_1.default.sign(data, "secret", {
                    expiresIn: process.env.AUTHTOKENLIFESPAN,
                });
                let refreshToken = jsonwebtoken_1.default.sign({ email: data.email }, "secret", {
                    expiresIn: process.env.REFRESHTOKENSPAN,
                });
                const { message, code } = constants_1.responseCodes.SUCCESS;
                res.json((0, utils_1.formatResponse)({
                    code,
                    message,
                    data: Object.assign(Object.assign({}, data), { token, refreshToken }),
                }));
            }
            else
                notFound();
        }
        else
            notFound();
    })
        .catch((err) => {
        const { code } = constants_1.responseCodes.NORECORDSFOUND;
        res.json((0, utils_1.formatResponse)({ code, message: err }));
    });
};
exports.loginController = loginController;
const updateUserDetails = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { fullName, email, mobileNo, id } = req.body;
    logger_1.default.log("updateUserDetails - started :", req.body);
    userDetailsModel_1.default
        .findOneAndUpdate({ id }, { $set: { fullName, email, mobileNo } }, { new: true })
        .then((result) => {
        const { code, message } = constants_1.responseCodes.UPDATED;
        res.json((0, utils_1.formatResponse)({ code, message, data: result }));
    })
        .catch(() => {
        const { message, code } = constants_1.responseCodes.NORECORDSFOUND;
        res.json((0, utils_1.formatResponse)({ code, message: `User ${message}` }));
    });
};
exports.updateUserDetails = updateUserDetails;
const deleteUser = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { user_id, email } = req.body;
    logger_1.default.log("deleteUser - started :", req.body);
    userDetailsModel_1.default
        .findOneAndDelete({ user_id, email })
        .then((result) => {
        if (result) {
            const { code, message } = constants_1.responseCodes.DELETED;
            res.json((0, utils_1.formatResponse)({ code, message, data: result }));
        }
        else {
            const { code, message } = constants_1.responseCodes.NORECORDSFOUND;
            res.json((0, utils_1.formatResponse)({ code, message }));
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
exports.deleteUser = deleteUser;
const refreshTokenDetails = (req, res) => {
    const { refreshToken } = req.body;
    logger_1.default.log("refreshTokenDetails - started :", req.body);
    const userData = jsonwebtoken_1.default.verify(refreshToken, "secret") || {};
    const { email } = userData;
    userDetailsModel_1.default
        .findOne({ email })
        .then((result) => {
        if (result) {
            const _a = result.toObject(), { password: dbPassword } = _a, data = __rest(_a, ["password"]);
            let token = jsonwebtoken_1.default.sign(data, "secret", {
                expiresIn: process.env.AUTHTOKENLIFESPAN,
            });
            const { message, code } = constants_1.responseCodes.SUCCESS;
            res.json((0, utils_1.formatResponse)({
                code,
                message,
                data: Object.assign(Object.assign({}, data), { token, refreshToken }),
            }));
        }
        else {
            const { message, code } = constants_1.responseCodes.NORECORDSFOUND;
            res.json((0, utils_1.formatResponse)({
                code,
                message,
            }));
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
exports.refreshTokenDetails = refreshTokenDetails;
const testingAPI = (req, res) => {
    res.json({ data: "testingAPItestingAPI" });
};
exports.testingAPI = testingAPI;
const testingAPIParam = (req, res) => {
    const { user } = req.body;
    res.json({ data: "testingAPIParam :" + user });
};
exports.testingAPIParam = testingAPIParam;
