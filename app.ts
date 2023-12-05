import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import userDetailsRoute from "./src/routes/userDetailsRoute";
import todoListRoute from "./src/routes/todoListRoute";
import notifyServicesRoute from "./src/routes/notifyServicesRoute";
const swaggerUi = require("swagger-ui-express");
import "./src/config/database";
import cors from "cors";

const app = express();
app.use(cors());
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

app.use("*", (_, response) => {
  response.status(404);
  response.end("Request URL not found.");
});

app.listen(8080, () => {
  console.log("welcome to todo List backend");
});
