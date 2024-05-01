import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";
import { entry } from "~/server/db/schema";

export const entryRouter = createTRPCRouter({
    getAllEntries: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.select().from(entry)
    }),
    
    createExpenseEntry: publicProcedure
        .input(z.object({
            amount: z.number().min(0),
            category: z.number(),
            subCategory: z.number(),
            type: z.enum(["Income", "Expense"]),
            desciption: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(entry).values(
                {
                    amount: input.amount,
                    categoryId: input.category,
                    type: input.type
                }
            )
        })
    
})