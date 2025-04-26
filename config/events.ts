import { json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name'),
    location: varchar('location'),
    link: varchar('link'),
    date: varchar('date'),
    time: varchar('time'),
    type: varchar('type'),
    imageurl: varchar('imageurl'),
    createdon: timestamp('createdon')
})