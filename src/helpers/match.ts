// types/match.ts
export type Player = { name: string; points: number };

export type MatchSummary = {
  id: string;                 // matchId
  teamAName: string;
  teamBName: string;
  playersA: Player[];
  playersB: Player[];
  scoreA: number;             // somme des points A
  scoreB: number;             // somme des points B
  durationMs: number;         // durée totale
  startedAt: number;          // timestamps utiles
  endedAt: number;
};
