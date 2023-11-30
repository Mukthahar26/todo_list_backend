import { Request, Response, Router } from "express";
import {
  deleteUserParams,
  loginParams,
  refreshTokenParams,
  registrationParams,
  updateUserParams,
} from "./paramValidation.ts";
import {
  registrationController,
  loginController,
  updateUserDetails,
  deleteUser,
} from "../controllers/userControllers.ts";
import jsonwebtoken from "jsonwebtoken";

const router = Router();

router.use((req: Request | any, res: Response, next) => {
  next();
});
router.post("/registration", registrationParams, registrationController);
router.get("/login", loginParams, loginController);
router.post("/updateUserDetails", updateUserParams, updateUserDetails);
router.post("/refreshToken", refreshTokenParams, deleteUser);
router.post("/deleteuser", deleteUserParams, deleteUser);

export default router;
