import { Router } from "express";
import { friendRequestController } from "./friendRequest.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authentication)

router.post(
    "/send-friendRequest/:receiverId",
    friendRequestController.sendFriendRequest
);

router.get(
    "/",
    friendRequestController.getFriendRequests
)

router.post(
    "/accept-friendRequest/:requestId",
    friendRequestController.acceptFriendRequest
);

router.post(
    "/reject-friendRequest/:requestId",
    friendRequestController.rejectFriendRequest
);

export default router;
