
import { json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const postSch = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    image_url: varchar('image_url').notNull(),
    visiblein: varchar('visiblein').notNull(),
    createdon: timestamp('createdon').notNull(),
    createdby: text('createdby').notNull(),
    name: text('name').notNull(),
})