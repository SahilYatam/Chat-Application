import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { chatController } from "./chat.controller.js";

const router = Router();

router.post("send-message", authentication, chatController.sendMessage);

router.patch(
    "markAsRead/:conversationId",
    authentication,
    chatController.editMessage
);

router.patch(
    "edit-message/:chatId/:conversationId",
    authentication,
    chatController.editMessage
);

router.patch(
    "delete-message/:chatId/:conversationId",
    authentication,
    chatController.deleteMessage
);

export default router;
