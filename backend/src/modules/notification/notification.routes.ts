import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { notificationController } from "./notification.controller.js";

const router = Router();
router.use(authentication);

router.get(
    "/get-notifications/:receiverId",
    notificationController.getUserNotifications,
);

router.patch(
    "/mark-as-read/:notificationId/:receiverId",
    notificationController.notificationMarkAsRead,
);

router.delete(
    "/delete-notifications/:notificationId/:receiverId",
    notificationController.deleteNotification,
);

export default router;
