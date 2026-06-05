import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  refreshAccessToken,
  changeCurrentPassword,
} from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

//? Auth routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").get(verifyJWT, currentUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;
