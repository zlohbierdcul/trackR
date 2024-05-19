import { z } from 'zod';

import { publicProcedure, createTRPCRouter } from '../trpc';
import { category } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export const categoryRouter = createTRPCRouter({
    getAllCategories: publicProcedure.query(({ ctx }) => {
        return ctx.db.select().from(category);
    }),

    getCategoryById: publicProcedure.input(z.number()).query(({ input, ctx }) => {
        return ctx.db.selectDistinct().from(category).where(eq(category.id, input)).limit(1);
    }),

    createCategory: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(category).values({
                name: input.name,
            });
        }),

    deleteCategoryById: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
        await ctx.db.delete(category).where(eq(category.id, input));
    }),
    editNameById: publicProcedure
        .input(z.object({ id: z.number(), name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db
                .update(category)
                .set({
                    name: input.name,
                })
                .where(eq(category.id, input.id));
        }),
});
