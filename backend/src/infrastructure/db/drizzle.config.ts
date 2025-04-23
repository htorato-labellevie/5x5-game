import { config } from 'dotenv';
config({ path: '/Users/htorato/5x5-game/.env' }); // ← 絶対パスに変更！
console.log('DATABASE_URL =', process.env.DATABASE_URL);

import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infrastructure/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
