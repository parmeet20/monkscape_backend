import { Request, Response } from "express";
import {
    createEvent,
    getEventById,
    getAllEvents,
    updateEvent,
    deleteEvent,
} from "../service/eventService";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserById } from "../service/userService";
import { getWebSocketServerManager } from "../ws/websocket";

export async function createEventHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const user = await getUserById(userId);
        if (!user || user.role !== "admin")
            return res.status(403).json({ success: false, message: "Forbidden" });

        const data = req.body;
        const newEvent = await createEvent(data);

        const wss = getWebSocketServerManager();
        wss.broadcastNotification(`New event created: ${newEvent.name}`);

        res.status(201).json({ success: true, event: newEvent });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to create event" });
    }
}

export async function getEventHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const event = await getEventById(id);
        if (!event)
            return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, event });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to get event" });
    }
}

export async function listEventsHandler(req: Request, res: Response) {
    try {
        const events = await getAllEvents();
        res.status(200).json({ success: true, events });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to list events" });
    }
}

export async function updateEventHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const user = await getUserById(userId);
        if (!user || user.role !== "admin")
            return res.status(403).json({ success: false, message: "Forbidden" });

        const { id } = req.params;
        const data = req.body;
        const updatedEvent = await updateEvent(id, data);
        res.status(200).json({ success: true, event: updatedEvent });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to update event" });
    }
}

export async function deleteEventHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const user = await getUserById(userId);
        if (!user || user.role !== "admin")
            return res.status(403).json({ success: false, message: "Forbidden" });

        const { id } = req.params;
        await deleteEvent(id);
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to delete event" });
    }
}
