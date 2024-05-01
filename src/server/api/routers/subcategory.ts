import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";
import { subCategory } from "~/server/db/schema";

export const subcategoryRouter = createTRPCRouter({
    getAllCategories: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.select().from(subCategory)
    }),
    
    createCategory: publicProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.insert(subCategory).values(
                {
                    name: input.name
                }
            )
        })
})