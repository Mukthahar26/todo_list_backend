"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const userDetailsRoute_1 = __importDefault(require("./src/routes/userDetailsRoute"));
const todoListRoute_1 = __importDefault(require("./src/routes/todoListRoute"));
const notifyServicesRoute_1 = __importDefault(require("./src/routes/notifyServicesRoute"));
const swaggerUi = require("swagger-ui-express");
require("./src/config/database");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
app.use("/userdetails", userDetailsRoute_1.default);
app.use("/todolist", todoListRoute_1.default);
app.use("/notify", notifyServicesRoute_1.default);
const outputFile = "./swagger.json";
app.use("/all-apis/swagger.json", swaggerUi.serve, swaggerUi.setup(Object.assign({}, require(outputFile))));
app.use("*", (_, response) => {
    response.status(404);
    response.end("Request URL not found.");
});
app.listen(8080, () => {
    console.log("welcome to todo List backend");
});
