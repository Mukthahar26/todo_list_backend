import { Request, Response, Router } from "express";
import {
  createTodoListParams,
  deleteUserParams,
  getTodoListParams,
  markAsCompletedParams,
  updateTodoListParams,
} from "./paramValidation.ts";
import {
  createTodoList,
  deleteTodoList,
  getAllTodoList,
  markAsCompletedTodoList,
  updateTodoList,
} from "../controllers/todoListController.ts";
import jsonwebtoken from "jsonwebtoken";

const todoListrouter = Router();

todoListrouter.use((req: Request | any, res: Response, next) => {
  const jwt_token = req.headers.authorization;
  if (!jwt_token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    const userData = jsonwebtoken.verify(jwt_token, "secret");
    req["userDetails"] = userData;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
});
todoListrouter.post("/createtodolist", createTodoListParams, createTodoList);
todoListrouter.get("/getalltodolist", getTodoListParams, getAllTodoList);
todoListrouter.post("/updatetodolist", updateTodoListParams, updateTodoList);
todoListrouter.put(
  "/markascompleted",
  markAsCompletedParams,
  markAsCompletedTodoList
);
todoListrouter.delete("/deletetodolist", deleteUserParams, deleteTodoList);

export default todoListrouter;
