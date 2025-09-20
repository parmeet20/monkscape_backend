import { prisma } from "../config/prismaClient";

export async function createEvent(data: {
    monasteryId: string;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    recurring?: boolean;
    status: "pending" | "confirmed" | "cancelled";
}) {
    return prisma.event.create({
        data,
    });
}

export async function getEventById(id: string) {
    return prisma.event.findUnique({
        where: { id },
    });
}

export async function getAllEvents() {
    return prisma.event.findMany();
}

export async function updateEvent(
    id: string,
    data: Partial<{
        monasteryId: string;
        name: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
        recurring?: boolean;
        status?: "pending" | "confirmed" | "cancelled";
    }>
) {
    return prisma.event.update({
        where: { id },
        data,
    });
}

export async function deleteEvent(id: string) {
    return prisma.event.delete({
        where: { id },
    });
}
