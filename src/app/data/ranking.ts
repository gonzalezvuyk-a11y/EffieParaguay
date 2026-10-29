export type RankingEntry = {
  name: string;
  points: number;
};

// Points as announced by the organization for the 2026 edition, highest first.
// The first entry of each list is the Agencia / Avisador del año.
export const agencyRanking: RankingEntry[] = [
  { name: 'Wild Fi', points: 88 },
  { name: 'Biedermann', points: 60 },
  { name: 'Kausa Central Creativa', points: 24 },
  { name: 'Oniria TBWA', points: 16 },
  { name: 'El Creativo', points: 12 },
  { name: 'Nasta', points: 8 },
  { name: 'AYO Agencia de Autor', points: 2 },
];

export const advertiserRanking: RankingEntry[] = [
  { name: 'Personal', points: 80 },
  { name: 'Nextar', points: 48 },
  { name: 'BDP SA', points: 24 },
  { name: 'Billy Smash', points: 12 },
  { name: 'Indufar', points: 12 },
  { name: 'Raizen', points: 8 },
  { name: 'Fundación Itaú', points: 8 },
  { name: 'Fortaleza', points: 6 },
  { name: 'Cervepar', points: 4 },
  { name: 'Universidad Central', points: 2 },
  { name: 'Senatur', points: 2 },
  { name: 'TaDa', points: 2 },
  { name: "McDonald's", points: 2 },
];

/** Competition ranking: tied entries share a position and the next one skips ahead (1, 2, 2, 4). */
export const withPositions = (entries: RankingEntry[]) =>
  entries.map((entry) => ({
    ...entry,
    position: entries.findIndex((other) => other.points === entry.points) + 1,
  }));
