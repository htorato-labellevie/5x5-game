// frontend/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'dpg-d045dsi4d50c739rg4qg-a.oregon-postgres.render.com',
    port: 5432,
    user: 'gomoku_db_user',
    password: 'Nk3MAgtztAJ6HsasxjSSvmpBBRp1zM6F',
    database: 'gomoku_db',
  },
});
