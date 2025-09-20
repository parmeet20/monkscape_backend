import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/loadEnv";
import { RegisterUserRequest } from "../types/types";
import { prisma } from "../config/prismaClient";

const SALT_ROUNDS = 10;
const JWT_SECRET = ENV.JWT_SECRET || "your_jwt_secret"; // Use 

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        if (!user) {
            new Error("user not found with id: " + id);
        }
        return user;
    } catch (error) {
        new Error("Error while fetching user with id: " + id);
    }
}

export async function registerUser(data: RegisterUserRequest) {
    const { username, email, password } = data;

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });

    if (existingUser) {
        throw new Error("Username or email already taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user record
    const user = await prisma.user.create({
        data: {
            username,
            email,
            hashedPassword, // default role
            role: 'admin'
        },
    });

    // Return user data (excluding hashedPassword)
    const { hashedPassword: _, ...userSafeData } = user;
    return userSafeData;
}

export async function loginUser(
    usernameOrEmail: string,
    password: string
): Promise<{ token: string; user: Omit<typeof user, "hashedPassword"> }> {
    // Find user by username or email
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
    });

    if (!user) {
        throw new Error("Invalid username/email or password");
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordValid) {
        throw new Error("Invalid username/email or password");
    }

    // Generate JWT token with user id and role
    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    // Return token and safe user data
    const { hashedPassword: _, ...userSafeData } = user;
    return { token, user: userSafeData };
}
