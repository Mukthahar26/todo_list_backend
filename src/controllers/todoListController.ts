import { Request, Response } from "express";
import {
  formatResponse,
  isDateUtc,
  validateRequestParams,
} from "../utils/utils";
import todoListModel from "../models/todoListModel";
import { v4 } from "uuid";
import { responseCodes } from "../constants/constants";

export const createTodoList = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { user_id, title, desc, end_at, priority } = req.body;
  if (isDateUtc(end_at)) {
    const todoList = new todoListModel({
      id: v4(),
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
        const { code, message } = responseCodes.SUCCESS;
        res.json(formatResponse({ code, message, data }));
      })
      .catch((err) => {
        const { code } = responseCodes.ERROR;
        res.json(formatResponse({ code, message: err }));
      });
  } else {
    const { code } = responseCodes.ERROR;
    res.json(
      formatResponse({ code, message: "End date is not in UTC format" })
    );
  }
};

export const getAllTodoList = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const {
    user_id,
    offset,
    limit,
    sort = "desc",
    search,
    filter = {},
  } = req.body;
  const { startDate, endDate, status, priority } = filter;
  const params: any = { user_id };
  if (startDate && endDate)
    params["end_at"] = {
      $gte: startDate,
      $lte: endDate,
    };
  if (status) params["status"] = status;
  if (priority) params["priority"] = priority;
  if (search) params["title"] = { $regex: new RegExp(search, "i") };
  todoListModel
    .find(params, null, { skip: offset, limit })
    .sort({ end_at: sort === "asc" ? 1 : -1 })
    .then((data) => {
      if (data.length === 0) {
        const { code, message } = responseCodes.NORECORDSFOUND;
        res.json(formatResponse({ code, message }));
      } else {
        const { code, message } = responseCodes.SUCCESS;
        res.json(formatResponse({ code, message, data: data }));
      }
    })
    .catch((error) => {
      const { message, code } = responseCodes.ERROR;
      res.json(
        formatResponse({
          code,
          message,
          data: error,
        })
      );
    });
};

export const deleteTodoList = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { user_id, postId } = req.body;
  todoListModel
    .findOneAndDelete({ user_id, id: postId })
    .then((result) => {
      if (result) {
        const { code, message } = responseCodes.DELETED;
        res.json(formatResponse({ code, message, data: result }));
      } else {
        const { code, message } = responseCodes.NORECORDSFOUND;
        res.json(formatResponse({ code, message }));
      }
    })
    .catch((error) => {
      const { message, code } = responseCodes.ERROR;
      res.json(
        formatResponse({
          code,
          message,
          data: error,
        })
      );
    });
};

export const updateTodoList = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { user_id, postId, title, desc, end_at, status, priority } = req.body;
  const params: any = { updated_at: new Date(new Date().toUTCString()) };
  if (title) params["title"] = title;
  if (desc) params["desc"] = desc;
  if (end_at) params["end_at"] = end_at;
  if (status) params["status"] = status;
  if (priority) params["priority"] = priority;
  todoListModel
    .findOneAndUpdate(
      { user_id, id: postId },
      {
        $set: params,
      },
      { new: true }
    )
    .then((data) => {
      if (data) {
        const { code, message } = responseCodes.UPDATED;
        res.json(formatResponse({ code, message, data }));
      } else {
        const { code, message } = responseCodes.NORECORDSFOUND;
        res.json(formatResponse({ code, message }));
      }
    })
    .catch((error) => {
      const { message, code } = responseCodes.ERROR;
      res.json(
        formatResponse({
          code,
          message,
          data: error,
        })
      );
    });
};

export const markAsCompletedTodoList = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { user_id, postId } = req.body;
  todoListModel
    .findOneAndUpdate(
      { user_id, id: postId },
      {
        $set: { user_id, id: postId, status: "Completed" },
      },
      { new: true }
    )
    .then((data) => {
      if (data) {
        const { code, message } = responseCodes.UPDATED;
        res.json(formatResponse({ code, message, data }));
      } else {
        const { code, message } = responseCodes.NORECORDSFOUND;
        res.json(formatResponse({ code, message }));
      }
    })
    .catch((error) => {
      const { message, code } = responseCodes.ERROR;
      res.json(
        formatResponse({
          code,
          message,
          data: error,
        })
      );
    });
};
