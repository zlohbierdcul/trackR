import { z } from 'zod';

import { publicProcedure, createTRPCRouter } from '../trpc';
import { category, entry, subCategory } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export const entryRouter = createTRPCRouter({
    getAllEntries: publicProcedure.query(({ ctx }) => {
        return ctx.db.select().from(entry);
    }),

    getAllEntriesWithCategory: publicProcedure.query(({ ctx }) => {
        return ctx.db
            .select()
            .from(entry)
            .innerJoin(category, eq(entry.categoryId, category.id))
            .leftJoin(subCategory, eq(entry.subCategoryId, subCategory.id));
    }),

    createEntry: publicProcedure
        .input(
            z.object({
                amount: z.number().min(0),
                category: z.number(),
                subCategory: z.number(),
                type: z.enum(['Income', 'Expense']),
                desciption: z.string().or(z.null()),
            })
        )
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(entry).values({
                amount: input.amount,
                categoryId: input.category,
                subCategoryId: input.subCategory,
                type: input.type,
                description: input.desciption,
            });
        }),
});
