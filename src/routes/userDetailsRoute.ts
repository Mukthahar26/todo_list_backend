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
router.post("/registration", registrationParams, registrationController);
router.get("/login", loginParams, loginController);
router.post("/updateUserDetails", updateUserParams, updateUserDetails);
router.post("/refreshToken", refreshTokenParams, deleteUser);
router.post("/deleteuser", deleteUserParams, deleteUser);

export default router;
