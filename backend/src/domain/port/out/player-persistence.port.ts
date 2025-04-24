export interface PlayerPersistencePort {
  findByName(name: string): Promise<{ name: string; visits: number } | null>;
  create(player: { name: string; visits: number }): Promise<void>;
  updateVisits(name: string, visits: number): Promise<void>;
}