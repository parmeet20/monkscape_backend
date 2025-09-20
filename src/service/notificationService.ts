import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/prismaClient";


// Get notifications for a user
export async function getUserNotifications(userId: string) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { id: "desc" },
    });
}

// Optionally: delete a notification (by id)
export async function deleteNotification(id: string, userId: string) {
    return prisma.notification.deleteMany({
        where: {
            id,
            userId,
        },
    });
}
