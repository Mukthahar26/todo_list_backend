import express, { Request, Response } from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import userDetailsRoute from "./routes/userDetailsRoute.ts";
import todoListRoute from "./routes/todoListRoute.ts";
import notifyServicesRoute from "./routes/notifyServicesRoute.ts";
const swaggerUi = require("swagger-ui-express");
import {} from "url";
import "./config/database.ts";

const port: any = process.env.PORT;
const baseUrl: any = process.env.BASEURL;

const app = express();
app.use(bodyParser.json());
app.use("/userdetails", userDetailsRoute);
app.use("/todolist", todoListRoute);
app.use("/notify", notifyServicesRoute);

const outputFile = "./../swagger.json";
app.use(
  "/all-apis/swagger.json",
  swaggerUi.serve,
  swaggerUi.setup({ ...require(outputFile), host: `${baseUrl}:${port}` })
);

app.use("*", (_, response) => {
  response.status(404);
  response.end("Request URL not found.");
});

app.listen(port, baseUrl, () => {
  console.log("welcome to my Portfolio");
});
