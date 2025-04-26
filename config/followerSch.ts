import { integer, varchar, serial, pgTable } from 'drizzle-orm/pg-core';

export const followerSch = pgTable('followers', {
    id: serial('id').primaryKey(),
    club_id: varchar('club_id'),
    username: varchar('username'),
});
