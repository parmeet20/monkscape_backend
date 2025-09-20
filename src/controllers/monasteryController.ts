import { Request, Response } from "express";
import {
    createMonastery,
    getMonasteryById,
    getAllMonasteries,
} from "../service/monasteryService";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserById } from "../service/userService";

// Create Monastery
export async function createMonasteryHandler(req: AuthRequest, res: Response) {
    try {
        const id = req.user?.userId;
        if (!id)
            return res.status(401).json({
                success: false,
                message: "Token not found",
            });

        const user = await getUserById(id);
        if (!user)
            return res.status(401).json({
                success: false,
                message: "User not found",
            });

        // Only allow admin role to create monasteries
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
        }

        const data = req.body;
        const monastery = await createMonastery(data);
        res.status(201).json({ success: true, monastery });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Could not create monastery" });
    }
}

// Get Monastery by ID
export async function getMonasteryHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const monastery = await getMonasteryById(id);
        if (!monastery)
            return res.status(404).json({ success: false, message: "Monastery not found" });
        res.status(200).json({ success: true, monastery });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to get monastery" });
    }
}

// List All Monasteries
export async function listMonasteriesHandler(req: Request, res: Response) {
    try {
        const monasteries = await getAllMonasteries();
        res.status(200).json({ success: true, monasteries });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to list monasteries" });
    }
}
