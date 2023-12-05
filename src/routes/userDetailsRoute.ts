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

router.use((_, __, next) => {
  next();
});
router.post("/registration", registrationParams, registrationController);
router.get("/login", loginParams, loginController);
router.put("/updateUserDetails", updateUserParams, updateUserDetails);
router.post("/refreshToken", refreshTokenParams, deleteUser);
router.delete("/deleteuser", deleteUserParams, deleteUser);
router.get("/testing", testingAPI);
router.get("/tester", userpram, testingAPIParam);

export default router;
