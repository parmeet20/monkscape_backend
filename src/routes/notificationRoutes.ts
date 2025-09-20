import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
    getNotificationsHandler,
    deleteNotificationHandler,
} from "../controllers/notificationController";

const routes = Router();

routes.get("/", authenticateToken, getNotificationsHandler);
routes.delete("/:id", authenticateToken, deleteNotificationHandler);

export default routes;
