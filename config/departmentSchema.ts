import { json, pgTable, text } from "drizzle-orm/pg-core";

export const departmentSch = pgTable('department', {
    dept_id: text('dept_id').primaryKey(),
    name: text('name').notNull(),
    hod: text('hod'),
})