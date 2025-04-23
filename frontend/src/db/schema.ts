import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core'

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name"),
  score: integer("score"),
});
