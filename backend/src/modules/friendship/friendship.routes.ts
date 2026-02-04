import { Router } from "express";
import { friendshipController } from "./friendship.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authentication)

router.get("/", friendshipController.getFriendList);

export default router;