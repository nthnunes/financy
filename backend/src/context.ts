import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { verifyToken } from "./utils/auth";

const connectionString = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export interface Context {
  prisma: PrismaClient;
  userId: string | null;
}

export async function createContext({
  req,
}: {
  req: { headers: { authorization?: string } };
}): Promise<Context> {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const decoded = token ? verifyToken(token) : null;
  return {
    prisma,
    userId: decoded?.userId ?? null,
  };
}
