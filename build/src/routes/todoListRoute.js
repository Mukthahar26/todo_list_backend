"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paramValidation_1 = require("./paramValidation");
const todoListController_1 = require("../controllers/todoListController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const todoListrouter = (0, express_1.Router)();
todoListrouter.use((req, res, next) => {
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
todoListrouter.post("/createtodolist", paramValidation_1.createTodoListParams, todoListController_1.createTodoList);
todoListrouter.get("/getalltodolist", todoListController_1.getAllTodoList);
todoListrouter.put("/updatetodolist", paramValidation_1.updateTodoListParams, todoListController_1.updateTodoList);
todoListrouter.put("/markascompleted", paramValidation_1.markAsCompletedParams, todoListController_1.markAsCompletedTodoList);
todoListrouter.delete("/deletetodolist", paramValidation_1.deleteUserParams, todoListController_1.deleteTodoList);
exports.default = todoListrouter;
