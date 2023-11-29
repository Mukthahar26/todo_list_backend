import { Router } from "express";
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

const todoListrouter = Router();

todoListrouter.use((__, _, next) => {
  next();
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
