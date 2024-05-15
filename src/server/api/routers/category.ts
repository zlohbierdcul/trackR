import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";
import { category } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(category);
  }),

  createCategory: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(category).values({
        name: input.name,
      });
    }),

  deleteCategoryById: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(category).where(eq(category.id, input));
    }),
});
