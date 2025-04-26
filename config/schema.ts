import { json, pgTable, text } from "drizzle-orm/pg-core";

export const admin = pgTable('admin', {
    username: text('username').primaryKey(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    email: text('email').notNull(),
})