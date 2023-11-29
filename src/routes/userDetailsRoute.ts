import { Router } from "express";
import {
  deleteUserParams,
  loginParams,
  registrationParams,
  resetPaswordParam,
  updateUserParams,
} from "./paramValidation.ts";
import {
  registrationController,
  loginController,
  updateUserDetails,
  deleteUser,
} from "../controllers/userControllers.ts";

const router = Router();

router.use((__, _, next) => {
  next();
});
router.post("/registration", registrationParams, registrationController);
router.get("/login", loginParams, loginController);
router.post("/updateUserDetails", updateUserParams, updateUserDetails);
router.post("/deleteuser", deleteUserParams, deleteUser);

export default router;
