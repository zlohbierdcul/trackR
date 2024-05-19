import { z } from 'zod';

import { publicProcedure, createTRPCRouter } from '../trpc';
import { subCategory } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export const subcategoryRouter = createTRPCRouter({
    getAllCategories: publicProcedure.query(({ ctx }) => {
        return ctx.db.select().from(subCategory);
    }),

    getCategoriesById: publicProcedure.input(z.number()).query(({ input, ctx }) => {
        return ctx.db.select().from(subCategory).where(eq(subCategory.categoryId, input));
    }),

    createCategory: publicProcedure
        .input(
            z.object({
                name: z.string(),
                categoryId: z.number(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(subCategory).values({
                name: input.name,
                categoryId: input.categoryId,
            });
        }),

    deleteSubCategoyById: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
        await ctx.db.delete(subCategory).where(eq(subCategory.id, input));
    }),

    deleteSubCategoryByCategory: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
        await ctx.db.delete(subCategory).where(eq(subCategory.categoryId, input));
    }),

    editNameById: publicProcedure
        .input(z.object({ id: z.number(), name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db
                .update(subCategory)
                .set({
                    name: input.name,
                })
                .where(eq(subCategory.id, input.id));
        }),
});
