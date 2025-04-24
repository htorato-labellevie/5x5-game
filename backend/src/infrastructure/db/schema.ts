import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 }).notNull().unique(),
  visits: integer('visits').notNull().default(1),
});

export type Player = InferModel<typeof players>;
export type PlayerInsert = Omit<Player, 'id'>; // insert時はid不要
export type PlayerUpdate = Partial<Omit<Player, 'id'>>; // update時は部分更新
