import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';


export const players = pgTable('players', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 64 }).notNull().unique(),
    visits: integer('visits').notNull().default(1), // ✅ 入場回数
  });
  