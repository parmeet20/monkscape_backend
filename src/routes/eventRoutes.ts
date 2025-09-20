import { Router } from "express";
import {
    createEventHandler,
    getEventHandler,
    listEventsHandler,
    updateEventHandler,
    deleteEventHandler,
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";

const routes = Router();

// Routes requiring authentication & admin role for mutation
routes.post("/create", authenticateToken, createEventHandler);
routes.put("/:id", authenticateToken, updateEventHandler);
routes.delete("/:id", authenticateToken, deleteEventHandler);

// Public read-only routes
routes.get("/", listEventsHandler);
routes.get("/:id", getEventHandler);

export default routes;
