import { Injectable } from "@nestjs/common";
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { players, type PlayerInsert, type PlayerUpdate } from '../db/schema';
import { PlayerPersistencePort } from '../../domain/port/out/player-persistence.port';

@Injectable()
export class PlayerRepositoryImpl implements PlayerPersistencePort {
  async findByName(name: string): Promise<{ name: string; visits: number } | null> {
    const result = await db.select().from(players).where(eq(players.name, name));
    if (result.length === 0) return null;
    return { name: result[0].name, visits: result[0].visits };
  }

  async create(player: PlayerInsert): Promise<void> {
    await db.insert(players).values(player);
  }

  async updateVisits(name: string, visits: number): Promise<void> {
    const data: PlayerUpdate = { visits };
    await db.update(players).set(data).where(eq(players.name, name));
  }
}
