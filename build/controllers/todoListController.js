"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsCompletedTodoList = exports.updateTodoList = exports.deleteTodoList = exports.getAllTodoList = exports.createTodoList = void 0;
const utils_1 = require("../utils/utils");
const todoListModel_1 = __importDefault(require("../models/todoListModel"));
const uuid_1 = require("uuid");
const constants_1 = require("../constants/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const createTodoList = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { user_id, title, desc, end_at, priority } = req.body;
    logger_1.default.log("createTodoList - started :", req.body);
    if ((0, utils_1.isDateUtc)(end_at)) {
        const todoList = new todoListModel_1.default({
            id: (0, uuid_1.v4)(),
            user_id,
            title,
            desc,
            create_at: new Date(new Date().toUTCString()),
            updated_at: new Date(new Date().toUTCString()),
            end_at,
            status: "Pending",
            priority,
        });
        todoList
            .save()
            .then((data) => {
            const { code, message } = constants_1.responseCodes.SUCCESS;
            res.json((0, utils_1.formatResponse)({ code, message, data }));
        })
            .catch((err) => {
            const { code } = constants_1.responseCodes.ERROR;
            res.json((0, utils_1.formatResponse)({ code, message: err }));
        });
    }
    else {
        const { code } = constants_1.responseCodes.ERROR;
        res.json((0, utils_1.formatResponse)({ code, message: "End date is not in UTC format" }));
    }
};
exports.createTodoList = createTodoList;
const getAllTodoList = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { user_id, offset, limit, sort = "desc", search, filter = {}, } = req.body;
    logger_1.default.log("getAllTodoList - started :", req.body);
    const { startDate, endDate, status, priority } = filter;
    const params = { user_id };
    if (startDate && endDate)
        params["end_at"] = {
            $gte: startDate,
            $lte: endDate,
        };
    if (status)
        params["status"] = status;
    if (priority)
        params["priority"] = priority;
    if (search)
        params["title"] = { $regex: new RegExp(search, "i") };
    logger_1.default.info("getAllTodoList API :", params);
    todoListModel_1.default
        .find(params, null, { skip: offset, limit })
        .sort({ end_at: sort === "asc" ? 1 : -1 })
        .then((data) => {
        logger_1.default.info("getAllTodoList API todoListModel data :", data);
        if (data.length === 0) {
            const { code, message } = constants_1.responseCodes.NORECORDSFOUND;
            res.json((0, utils_1.formatResponse)({ code, message }));
        }
        else {
            const { code, message } = constants_1.responseCodes.SUCCESS;
            res.json((0, utils_1.formatResponse)({ code, message, data: data }));
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
exports.getAllTodoList = getAllTodoList;
const deleteTodoList = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { user_id, todolistid } = req.body;
    logger_1.default.log("deleteTodoList - started :", req.body);
    todoListModel_1.default
        .findOneAndDelete({ user_id, id: todolistid })
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
exports.deleteTodoList = deleteTodoList;
const updateTodoList = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { user_id, todolistid, title, desc, end_at, status, priority } = req.body;
    logger_1.default.log("updateTodoList - started :", req.body);
    const params = { updated_at: new Date(new Date().toUTCString()) };
    if (title)
        params["title"] = title;
    if (desc)
        params["desc"] = desc;
    if (end_at)
        params["end_at"] = end_at;
    if (status)
        params["status"] = status;
    if (priority)
        params["priority"] = priority;
    todoListModel_1.default
        .findOneAndUpdate({ user_id, id: todolistid }, {
        $set: params,
    }, { new: true })
        .then((data) => {
        if (data) {
            const { code, message } = constants_1.responseCodes.UPDATED;
            res.json((0, utils_1.formatResponse)({ code, message, data }));
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
exports.updateTodoList = updateTodoList;
const markAsCompletedTodoList = (req, res) => {
    (0, utils_1.validateRequestParams)(req, res);
    const { user_id, todolistid } = req.body;
    logger_1.default.log("markAsCompletedTodoList - started :", req.body);
    todoListModel_1.default
        .findOneAndUpdate({ user_id, id: todolistid }, {
        $set: { user_id, id: todolistid, status: "Completed" },
    }, { new: true })
        .then((data) => {
        if (data) {
            const { code, message } = constants_1.responseCodes.UPDATED;
            res.json((0, utils_1.formatResponse)({ code, message, data }));
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
exports.markAsCompletedTodoList = markAsCompletedTodoList;
