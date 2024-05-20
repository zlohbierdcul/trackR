// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm';
import { integer, pgEnum, pgTableCreator, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `trackr_${name}`);

export const entryTypeEnum = pgEnum('type', ['Income', 'Expense']);
export const fixCostEnum = pgEnum('billing_period', ['Monthly', 'Quarterly', 'Yearly']);

export const entry = createTable('entries', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    type: entryTypeEnum('type').default('Expense').notNull(),
    amount: integer('amount').default(0).notNull(),
    categoryId: integer('category_id').references(() => category.id),
    subCategoryId: integer('subcategory_id').references(() => subCategory.id),
    description: varchar('description', { length: 256 }),
});

export const category = createTable('category', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    type: entryTypeEnum('type').default('Expense').notNull(),
});

export const subCategory = createTable('subcategories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    categoryId: integer('category_id').references(() => category.id),
});

export const fixCost = createTable('fix_cost', {
    id: serial('id').primaryKey(),
    amount: integer('amount').notNull(),
    billingPeriod: fixCostEnum('billing_period').notNull(),
    categoryId: integer('category_id').references(() => category.id),
    subcategoryId: integer('subcategory_id').references(() => subCategory.id),
});
