import { Player } from '../../domain/model/game.types';

export interface PlayerRepository {
  findByName(name: string): Promise<{ name: string; visits: number } | null>;
  updateVisits(name: string, visits: number): Promise<void>;
  create(player: { name: string; visits: number }): Promise<void>;
}

export class PlayerRepositoryImpl implements PlayerRepository {
  private players: Map<string, number> = new Map();

  async findByName(name: string) {
    const visits = this.players.get(name);
    return visits !== undefined ? { name, visits } : null;
  }

  async updateVisits(name: string, visits: number) {
    this.players.set(name, visits);
  }

  async create(player: { name: string; visits: number }) {
    this.players.set(player.name, player.visits);
  }
}
