import { Context } from "../context";
import { hashPassword, verifyPassword, signToken } from "../utils/auth";
import { GraphQLError } from "graphql";

function requireAuth(context: Context) {
  if (!context.userId) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.userId;
}

function formatUser(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };
}

function formatCategory(category: {
  id: string;
  name: string;
  userId: string;
}) {
  return category;
}

function formatTransaction(transaction: {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: Date;
  categoryId: string | null;
  userId: string;
  category?: { id: string; name: string; userId: string } | null;
}) {
  return {
    ...transaction,
    date: transaction.date.toISOString(),
    category: transaction.category
      ? formatCategory(transaction.category)
      : null,
  };
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);
      const user = await context.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true },
      });
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return formatUser(user);
    },
    categories: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);
      const categories = await context.prisma.category.findMany({
        where: { userId },
      });
      return categories.map(formatCategory);
    },
    transactions: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);
      const transactions = await context.prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
      });
      return transactions.map(formatTransaction);
    },
  },
  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } },
      context: Context,
    ) => {
      const existing = await context.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existing) {
        throw new GraphQLError("Email already registered", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const passwordHash = await hashPassword(input.password);
      const user = await context.prisma.user.create({
        data: { name: input.name, email: input.email, password: passwordHash },
        select: { id: true, name: true, email: true, createdAt: true },
      });
      const token = signToken(user.id);
      return { token, user: formatUser(user) };
    },
    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      context: Context,
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user || !(await verifyPassword(input.password, user.password))) {
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const token = signToken(user.id);
      const { password: _pw, ...safe } = user;
      return { token, user: formatUser(safe) };
    },
    createCategory: async (
      _: unknown,
      { input }: { input: { name: string } },
      context: Context,
    ) => {
      const userId = requireAuth(context);
      const category = await context.prisma.category.create({
        data: { name: input.name, userId },
      });
      return formatCategory(category);
    },
    updateCategory: async (
      _: unknown,
      { id, input }: { id: string; input: { name: string } },
      context: Context,
    ) => {
      const userId = requireAuth(context);
      const existing = await context.prisma.category.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const category = await context.prisma.category.update({
        where: { id },
        data: { name: input.name },
      });
      return formatCategory(category);
    },
    deleteCategory: async (
      _: unknown,
      { id }: { id: string },
      context: Context,
    ) => {
      const userId = requireAuth(context);
      const existing = await context.prisma.category.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new GraphQLError("Category not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      await context.prisma.category.delete({ where: { id } });
      return true;
    },
    createTransaction: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          title: string;
          amount: number;
          type: string;
          date: string;
          categoryId?: string | null;
        };
      },
      context: Context,
    ) => {
      const userId = requireAuth(context);
      if (input.categoryId) {
        const category = await context.prisma.category.findFirst({
          where: { id: input.categoryId, userId },
        });
        if (!category) {
          throw new GraphQLError("Category not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
      }
      const transaction = await context.prisma.transaction.create({
        data: {
          title: input.title,
          amount: input.amount,
          type: input.type,
          date: new Date(input.date),
          categoryId: input.categoryId ?? null,
          userId,
        },
        include: { category: true },
      });
      return formatTransaction(transaction);
    },
    updateTransaction: async (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          title?: string;
          amount?: number;
          type?: string;
          date?: string;
          categoryId?: string | null;
        };
      },
      context: Context,
    ) => {
      const userId = requireAuth(context);
      const existing = await context.prisma.transaction.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new GraphQLError("Transaction not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (input.categoryId != null) {
        const category = await context.prisma.category.findFirst({
          where: { id: input.categoryId, userId },
        });
        if (!category) {
          throw new GraphQLError("Category not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
      }
      const transaction = await context.prisma.transaction.update({
        where: { id },
        data: {
          ...(input.title != null && { title: input.title }),
          ...(input.amount != null && { amount: input.amount }),
          ...(input.type != null && { type: input.type }),
          ...(input.date != null && { date: new Date(input.date) }),
          ...(input.categoryId !== undefined && {
            categoryId: input.categoryId,
          }),
        },
        include: { category: true },
      });
      return formatTransaction(transaction);
    },
    deleteTransaction: async (
      _: unknown,
      { id }: { id: string },
      context: Context,
    ) => {
      const userId = requireAuth(context);
      const existing = await context.prisma.transaction.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new GraphQLError("Transaction not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      await context.prisma.transaction.delete({ where: { id } });
      return true;
    },
  },
};
