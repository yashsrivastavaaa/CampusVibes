
import { json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const clubsSch = pgTable('clubs', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    club_logo: varchar('club_logo').notNull(),
    about: varchar('about').notNull(),
    createdon: timestamp('createdon').notNull(),
})