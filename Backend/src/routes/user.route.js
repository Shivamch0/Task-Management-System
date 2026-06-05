import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser , loginUser, logoutUser  , currentUser , refreshAccessToken} from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser)

router.route("/refresh-token").post(refreshAccessToken)

//? Auth routes
router.route("/logout").post(verifyJWT , logoutUser);

router.route("/current-user").get(verifyJWT , currentUser )

export default router;