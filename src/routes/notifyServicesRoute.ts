import { Router } from "express";
import {
  resetPaswordParam,
  updateNewPasswordParams,
} from "./paramValidation.ts";
import {
  updateNewPassword,
  resetPassword,
} from "../controllers/notifyServicesController.ts";

const notifyServicesRouter = Router();

notifyServicesRouter.use((__, _, next) => {
  next();
});
notifyServicesRouter.post("/restpassword", resetPaswordParam, resetPassword);
notifyServicesRouter.post(
  "/updateNewPassword",
  updateNewPasswordParams,
  updateNewPassword
);

export default notifyServicesRouter;
