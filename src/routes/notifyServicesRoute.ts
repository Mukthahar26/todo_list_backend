import { Request, Response, Router } from "express";
import { resetPaswordParam, updateNewPasswordParams } from "./paramValidation";
import {
  updateNewPassword,
  resetPassword,
} from "../controllers/notifyServicesController";
import jsonwebtoken from "jsonwebtoken";

const notifyServicesRouter = Router();

notifyServicesRouter.use((req: Request | any, res: Response, next) => {
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

notifyServicesRouter.post("/restpassword", resetPaswordParam, resetPassword);
notifyServicesRouter.post(
  "/updateNewPassword",
  updateNewPasswordParams,
  updateNewPassword
);

export default notifyServicesRouter;
