import { prisma } from "../config/prismaClient";

export async function createPost(data: {
    title: string;
    description: string;
    imageUrl?: string
    userId: string;
}) {
    return prisma.post.create({
        data,
    });
}

export async function getPostById(id: string) {
    return prisma.post.findUnique({
        where: { id },
    });
}

export async function getAllPosts() {
    return prisma.post.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function updatePost(
    id: string,
    data: Partial<{ title: string; description: string }>
) {
    return prisma.post.update({
        where: { id },
        data,
    });
}

export async function deletePost(id: string) {
    return prisma.post.delete({
        where: { id },
    });
}

export async function incrementViews(id: string) {
    return prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
    });
}
