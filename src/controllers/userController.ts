import { Request, Response } from "express";
import {
    RegisterUserRequest,
} from "../types/types";
import { registerUser, loginUser, getUserById } from "../service/userService";
import { z } from "zod";
import { AuthRequest } from "../middleware/authMiddleware";


export const getUserFromToken = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId || !req.user) {
            return res.status(403).json({
                status: false,
                message: "Access denied",
            });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }

        // Exclude sensitive fields like hashedPassword before sending
        const { hashedPassword, ...safeUser } = user;

        return res.status(200).json({
            status: true,
            user: safeUser,
        });
    } catch (error: any) {
        console.error("Error in getUserFromToken:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

// Register Controller
export async function register(req: Request, res: Response) {
    try {
        // Validate request body with Zod schema
        const validatedData = RegisterUserRequest.parse(req.body);

        // Delegate to service
        const user = await registerUser(validatedData);

        // Send success response (exclude sensitive data)
        res.status(201).json({ success: true, user });
    } catch (error: any) {
        // Handle validation and service errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, errors: error });
        }
        res.status(400).json({ success: false, message: error.message || "Registration failed" });
    }
}

// Login Controller
export async function login(req: Request, res: Response) {
    try {
        // Basic validation
        const { usernameOrEmail, password } = req.body;
        if (typeof usernameOrEmail !== "string" || typeof password !== "string") {
            return res.status(400).json({ success: false, message: "Invalid credentials format" });
        }

        // Delegate to service
        const { token, user } = await loginUser(usernameOrEmail, password);

        // Send token and user data back
        res.status(200).json({ success: true, token, user });
    } catch (error: any) {
        res.status(401).json({ success: false, message: error.message || "Authentication failed" });
    }
}
