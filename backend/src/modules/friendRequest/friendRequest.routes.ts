import { Router } from "express";
import { friendRequestController } from "./friendRequest.controller.js";
import { authentication } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authentication)

router.post(
    "/send/:receiverId",
    friendRequestController.sendFriendRequest
);

router.get(
    "/",
    friendRequestController.getFriendRequests
)

router.get(
    "/:otherUserId",
    friendRequestController.getFriendshipStatus
)

router.post(
    "/accept/:requestId",
    friendRequestController.acceptFriendRequest
);

router.post(
    "/reject/:requestId",
    friendRequestController.rejectFriendRequest
);

export default router;
