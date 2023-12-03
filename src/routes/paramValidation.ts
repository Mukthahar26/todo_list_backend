import { body } from "express-validator";

export const registrationParams = [
  body("fullName").notEmpty().notEmpty().isString(),
  body("email").isEmail().notEmpty(),
  body("password").notEmpty().isString(),
  body("mobileNo").notEmpty().isString(),
];

export const loginParams = [
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isString(),
];

export const updateUserParams = [
  body("fullName").notEmpty().notEmpty().isString(),
  body("email").isEmail().notEmpty(),
  body("mobileNo").notEmpty().isString(),
  body("id").notEmpty().isString(),
];

export const createTodoListParams = [
  body("user_id").notEmpty().isString(),
  body("title").notEmpty().isString(),
  body("desc").notEmpty().isString(),
  body("priority").notEmpty().isString(),
  body("end_at").notEmpty().isString(),
];

export const getTodoListParams = [
  body("user_id").notEmpty().isString(),
  body("offset").optional().isInt(),
  body("filter.status")
    .optional()
    .isIn(["Pending", "Completed"])
    .withMessage("Invalid status keyword"),
  body("filter.priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority keyword"),
  body("sort")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Invalid sort order"),
];

export const updateTodoListParams = [
  body("user_id").notEmpty().isString(),
  body("todolistid").notEmpty().isString(),
  body("title").optional().isString(),
  body("desc").optional().isString(),
  body("priority").optional().isString(),
  body("end_at").optional().isString(),
  body("filter.priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority keyword"),
  body("filter.status")
    .optional()
    .isIn(["Pending", "Completed"])
    .withMessage("Invalid status keyword"),
];

export const markAsCompletedParams = [
  body("user_id").notEmpty().isString(),
  body("todolistid").notEmpty().isString(),
];

export const deleteUserParams = [
  body("user_id").notEmpty().isString(),
  body("email").notEmpty().isString(),
];

export const resetPaswordParam = [body("email").notEmpty().isString()];
export const otpRequestParam = [body("email").notEmpty().isString()];

export const updateNewPasswordParams = [
  body("email").notEmpty().isString(),
  body("otp_token").notEmpty().isString(),
  body("otp").notEmpty().isString(),
  body("newPassword").notEmpty().isString(),
];

export const refreshTokenParams = [body("refreshToken").notEmpty().isString()];
