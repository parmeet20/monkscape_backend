import { Router } from "express";
import {
    createPostHandler,
    getPostHandler,
    listPostsHandler,
    updatePostHandler,
    deletePostHandler,
    incrementViewHandler,
} from "../controllers/postController";
import { authenticateToken } from "../middleware/authMiddleware";

const routes = Router();

// Public routes
routes.get("/", listPostsHandler);
routes.get("/:id", getPostHandler);

// Protected routes - require login
routes.post("/create", authenticateToken, createPostHandler);
routes.put("/:id", authenticateToken, updatePostHandler);
routes.put("/view/:id", incrementViewHandler);
routes.delete("/:id", authenticateToken, deletePostHandler);

export default routes;
