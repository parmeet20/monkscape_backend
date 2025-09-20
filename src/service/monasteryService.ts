import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createMonastery(data: {
  name: string;
  description?: string;
  establishedYear?: number;
  address?: string;
  geoLatitude: number;
  geoLongitude: number;
  mainImageUrl?: string;
}) {
  return prisma.monastery.create({
    data,
  });
}

export async function getMonasteryById(id: string) {
  return prisma.monastery.findUnique({
    where: { id },
  });
}

export async function getAllMonasteries() {
  return prisma.monastery.findMany();
}
