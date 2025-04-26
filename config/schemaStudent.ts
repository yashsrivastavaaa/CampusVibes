import { json, pgTable, text } from "drizzle-orm/pg-core";

export const student = pgTable('students', {
    username: text('username').primaryKey(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    email: text('email').notNull(),
    dept_id: text('dept_id').notNull(),
})