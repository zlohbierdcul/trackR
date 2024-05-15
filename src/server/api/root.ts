import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { entryRouter } from "./routers/entry";
import { category, subCategory } from "../db/schema";
import { categoryRouter } from "./routers/category";
import { subcategoryRouter } from "./routers/subcategory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  entry: entryRouter,
  category: categoryRouter,
  subCategory: subcategoryRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
