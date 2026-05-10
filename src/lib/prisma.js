import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const softDeleteModels = new Set(["User"]);

          if (!softDeleteModels.has(model)) return query(args);

          const readOps = new Set([
            "findFirst",
            "findFirstOrThrow",
            "findMany",
            "count",
            "aggregate",
            "groupBy",
          ]);

          if (!readOps.has(operation)) return query(args);
          if (operation.startsWith("findUnique")) return query(args);

          args = args || {};
          args.where = args.where || {};
          if (!("deletedAt" in args.where)) {
            args.where.deletedAt = null;
          }
          return query(args);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}