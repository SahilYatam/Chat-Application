import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { chatController } from "./chat.controller.js";

const router = Router();

router.use(authentication);

router.post("/send-message", chatController.sendMessage);

router.get("/:conversationId", chatController.getMessages);

router.patch(
    "/edit-message/:chatId/:conversationId",
    chatController.editMessage,
);

router.patch(
    "/delete-message/:chatId/:conversationId",
    chatController.deleteMessage,
);

export default router;
