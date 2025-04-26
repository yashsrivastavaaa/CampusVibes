import { json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const visitor = pgTable('visitor', {
    username: varchar('username').primaryKey(),
    name: varchar('name'),
    password: varchar('password')
})