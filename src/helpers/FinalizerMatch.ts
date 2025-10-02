// helpers/finalizeMatch.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function finalizeMatch({
  matchId, teamAName, teamBName, playersA, playersB, durationMs, startedAt, endedAt,
}: {
  matchId: string;
  teamAName: string; teamBName: string;
  playersA: { name: string; score: number }[];
  playersB: { name: string; score: number }[];
  durationMs: number; startedAt: number; endedAt: number;
}) {
  const scoreA = playersA.reduce((s,p)=>s+p.score,0);
  const scoreB = playersB.reduce((s,p)=>s+p.score,0);

  const summary = {
    id: matchId,
    teamAName, teamBName,
    playersA: playersA.map(p=>({ name: p.name, points: p.score })),
    playersB: playersB.map(p=>({ name: p.name, points: p.score })),
    scoreA, scoreB, durationMs, startedAt, endedAt,
  };

  await AsyncStorage.setItem(`match:summary:${matchId}`, JSON.stringify(summary));
  return summary;
}
