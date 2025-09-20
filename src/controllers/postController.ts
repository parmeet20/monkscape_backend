import { Request, Response } from "express";
import {
    createPost,
    getPostById,
    getAllPosts,
    updatePost,
    deletePost,
} from "../service/postService";
import { AuthRequest } from "../middleware/authMiddleware";

// Create Post - any authenticated user
export async function createPostHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        const post = await createPost({ title, description, userId });
        res.status(201).json({ success: true, post });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to create post" });
    }
}

// Get Post by ID
export async function getPostHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const post = await getPostById(id);
        if (!post)
            return res.status(404).json({ success: false, message: "Post not found" });
        res.status(200).json({ success: true, post });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to get post" });
    }
}

// List All Posts (public)
export async function listPostsHandler(req: Request, res: Response) {
    try {
        const posts = await getAllPosts();
        res.status(200).json({ success: true, posts });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to list posts" });
    }
}

// Update Post - only author can update
export async function updatePostHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const post = await getPostById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        if (post.userId !== userId)
            return res.status(403).json({ success: false, message: "Forbidden" });

        const data = req.body;
        const updatedPost = await updatePost(id, data);
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to update post" });
    }
}

// Delete Post - only author can delete
export async function deletePostHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const post = await getPostById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Allow delete if user is author OR admin
        if (post.userId !== userId && userRole !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        await deletePost(id);
        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to delete post" });
    }
}

