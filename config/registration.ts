import { integer, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const registration = pgTable('registration', {
    id: serial('id').primaryKey(),
    event_id: integer('event_id'),
    registertime: timestamp('registertime'),
    userid: varchar('userid'),
})