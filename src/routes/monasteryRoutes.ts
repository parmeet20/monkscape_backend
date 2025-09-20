import { Router } from "express";
import {
    createMonasteryHandler,
    getMonasteryHandler,
    listMonasteriesHandler,
} from "../controllers/monasteryController";
import { authenticateToken } from "../middleware/authMiddleware";

const routes = Router();

routes.post("/create", authenticateToken, createMonasteryHandler);

routes.get("/", listMonasteriesHandler);
routes.get("/:id", getMonasteryHandler);

export default routes;
