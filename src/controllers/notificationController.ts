import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserNotifications, deleteNotification } from "../service/notificationService";

// GET: Get all notifications for the authenticated user
export async function getNotificationsHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const notifications = await getUserNotifications(userId);
        res.status(200).json({ notifications });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch notifications" });
    }
}

// DELETE: Delete a notification by id (for this user)
export async function deleteNotificationHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        if (!userId || !id) return res.status(400).json({ message: "User or id missing" });

        await deleteNotification(id, userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to delete notification" });
    }
}
