import http from "http";
import WebSocket, { Server } from "ws";
import jwt from "jsonwebtoken";
import { WSClient, WSOutgoingMessage } from "./wstypes";
import { prisma } from "../config/prismaClient";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

class WebSocketServerManager {
    private wss: Server;
    private clients: Map<string, WSClient> = new Map();

    constructor(server: http.Server) {
        this.wss = new Server({ server });

        this.wss.on("connection", (socket: WebSocket, request) => {
            try {
                const url = new URL(request.url ?? "", "http://localhost");
                const token = url.searchParams.get("token");

                if (!token) {
                    socket.close(1008, "Unauthorized: Token missing");
                    return;
                }

                // Verify token
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
                const userId = decoded.userId;

                if (!userId) {
                    socket.close(1008, "Unauthorized: Invalid token");
                    return;
                }

                // Store client connection
                this.clients.set(userId, { userId, socket });

                // Clean up on disconnect
                socket.on("close", () => {
                    this.clients.delete(userId);
                });

            } catch (error) {
                socket.close(1008, "Unauthorized: Token verification failed");
            }
        });
    }

    private serializeMessage(message: WSOutgoingMessage) {
        return JSON.stringify(message);
    }

    public async sendNotificationToUser(userId: string, message: string) {
        // Save notification to DB
        try {
            await prisma.notification.create({
                data: {
                    userId,
                    message,
                },
            });
        } catch (e) {
            console.error("Failed saving notification:", e);
        }

        const client = this.clients.get(userId);
        if (client && client.socket.readyState === WebSocket.OPEN) {
            const wsMessage: WSOutgoingMessage = {
                type: "notification",
                data: {
                    message,
                    timestamp: new Date().toISOString(),
                },
            };
            client.socket.send(this.serializeMessage(wsMessage));
        } else {
            console.log(`User ${userId} offline. Notification saved but not pushed.`);
        }
    }

    public broadcastNotification(message: string) {
        const wsMessage: WSOutgoingMessage = {
            type: "notification",
            data: {
                message,
                timestamp: new Date().toISOString(),
            },
        };

        this.clients.forEach(client => {
            if (client.socket.readyState === WebSocket.OPEN) {
                client.socket.send(this.serializeMessage(wsMessage));
            }
        });
    }
}

let webSocketServerManager: WebSocketServerManager | null = null;

export function initWebSocketServer(server: http.Server) {
    if (!webSocketServerManager) {
        webSocketServerManager = new WebSocketServerManager(server);
    }
    return webSocketServerManager;
}

export function getWebSocketServerManager() {
    if (!webSocketServerManager) {
        throw new Error("WebSocketServerManager not initialized");
    }
    return webSocketServerManager;
}
