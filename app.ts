import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import userDetailsRoute from "./src/routes/userDetailsRoute";
import todoListRoute from "./src/routes/todoListRoute";
import notifyServicesRoute from "./src/routes/notifyServicesRoute";
const swaggerUi = require("swagger-ui-express");
import "./src/config/database";
import process from "node:process";
import logger from "./src/utils/logger";

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use("/userdetails", userDetailsRoute);
app.use("/todolist", todoListRoute);
app.use("/notify", notifyServicesRoute);

const outputFile = "./swagger.json";
app.use(
  "/all-apis/swagger.json",
  swaggerUi.serve,
  swaggerUi.setup({ ...require(outputFile) })
);

process.on("uncaughtException", (err, origin) => {
  logger.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// app.use("*", (_, response) => {
//   response.status(404);
//   response.end("Request URL not found.");
// });

app.listen(8080, () => {
  console.log("welcome to todo List backend");
});
