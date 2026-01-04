import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authentication, authController.logout);
router.post("/recover-username", authController.forgotUsername);
router.post("/forgot-password-request", authController.forgotPasswordRequest);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/refresh-access-token", authController.refreshAccessToken);

export default router;