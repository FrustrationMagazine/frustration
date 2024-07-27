import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}
export const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_END === "development") global.prisma = prisma;
