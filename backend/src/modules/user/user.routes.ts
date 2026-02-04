import { Router } from "express";
import { userController } from "./user.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(authentication);

router.get("/my-profile", userController.myProfile);
router.get("/search-user", userController.searchUserByUsername);

export default router;