import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";
import { subCategory } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const subcategoryRouter = createTRPCRouter({
    getAllCategories: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.select().from(subCategory)
    }),
    
    createCategory: publicProcedure
        .input(z.object({
            name: z.string(),
            categoryId: z.number()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(subCategory).values(
                {
                    name: input.name,
                    categoryId: input.categoryId
                }
            )
    }),

    deleteSubCategoryByCategory: publicProcedure
        .input(z.number())
        .mutation(async ({ input, ctx }) => {
            await ctx.db.delete(subCategory).where(eq(subCategory.categoryId, input))
        })
})