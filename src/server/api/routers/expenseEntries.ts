import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";
import { expenseEntries } from "~/server/db/schema";

export const expenseEntriesRouter = createTRPCRouter({
    getAllEntries: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.select().from(expenseEntries)
    }),
    
    createExpenseEntry: publicProcedure
        .input(z.object({
            amount: z.number().min(0),
            category: z.string(),
            subCategory: z.string(),
            desciption: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(expenseEntries).values(
                {
                    amount: input.amount,
                    category: input.category,
                    subCategory: input.subCategory,
                    description: input.desciption
                }
            )
        })
    
})