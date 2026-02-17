import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { notificationController } from "./notification.controller.js";

const router = Router();
router.use(authentication);

router.get(
    "/",
    notificationController.getUserNotifications,
);

router.patch(
    "/mark-as-read/:notificationId",
    notificationController.notificationMarkAsRead,
);

router.delete(
    "/delete/:notificationId",
    notificationController.deleteNotification,
);

export default router;
