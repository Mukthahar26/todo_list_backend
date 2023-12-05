import { Request, Response, Router } from "express";
import {
  deleteUserParams,
  loginParams,
  refreshTokenParams,
  registrationParams,
  updateUserParams,
  userpram,
} from "./paramValidation";
import {
  registrationController,
  loginController,
  updateUserDetails,
  deleteUser,
  testingAPI,
  testingAPIParam,
} from "../controllers/userControllers";

const router = Router();

router
  .use((_, __, next) => {
    next();
  })
  .post("/registration", registrationParams, registrationController)
  .get("/login", loginParams, loginController)
  .put("/updateUserDetails", updateUserParams, updateUserDetails)
  .post("/refreshToken", refreshTokenParams, deleteUser)
  .delete("/deleteuser", deleteUserParams, deleteUser)
  .get("/testing", testingAPI)
  .get("/tester", userpram, testingAPIParam);

export default router;
