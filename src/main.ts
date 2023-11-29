import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import userDetailsRoute from "./routes/userDetailsRoute.ts";
import todoListRoute from "./routes/todoListRoute.ts";
import notifyServicesRoute from "./routes/notifyServicesRoute.ts";
import "./config/database.ts";

const app = express();
app.use(bodyParser.json());

app.use("/userdetails", userDetailsRoute);
app.use("/todolist", todoListRoute);
app.use("/notify", notifyServicesRoute);

app.use("*", (_, response) => {
  response.status(404);
  response.end("Request URL not found.");
});

app.listen(8080, () => {
  console.log("welcome to my Portfolio");
});
