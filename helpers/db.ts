import { PrismaClient, Prisma } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  (globalForPrisma.prisma as PrismaClient | undefined) ??
  (new (PrismaClient as any)() as PrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;