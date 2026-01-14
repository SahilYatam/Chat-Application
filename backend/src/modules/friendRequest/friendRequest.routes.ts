import { Router } from "express";
import { friendRequestController } from "./friendRequest.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post(
    "/send-friendRequest/:receiverId",
    authentication,
    friendRequestController.sendFriendRequest
);

router.post(
    "/accept-friendRequest/:requestId",
    authentication,
    friendRequestController.acceptFriendRequest
);

router.post(
    "/reject-friendRequest/:requestId",
    authentication,
    friendRequestController.rejectFriendRequest
);

export default router;
