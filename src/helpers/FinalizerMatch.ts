// helpers/finalizeMatch.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type Player = { name: string; score: number };

export async function finalizeMatch({
  matchId, teamAName, teamBName, playersA, playersB, durationMs, startedAt, endedAt,
}: {
  matchId: string;
  teamAName: string; teamBName: string;
  playersA: Player[]; playersB: Player[];
  durationMs: number; startedAt: number; endedAt: number;
}) {
  const scoreA = playersA.reduce((s,p)=>s+p.score,0);
  const scoreB = playersB.reduce((s,p)=>s+p.score,0);

  const summary = {
    id: matchId,
    teamAName, teamBName,
    playersA: playersA.map(p => ({ name: p.name, points: p.score })),
    playersB: playersB.map(p => ({ name: p.name, points: p.score })),
    scoreA, scoreB, durationMs, startedAt, endedAt,
  };

  const key = `match:summary:${matchId}`;        // 👈 clé unique
  await AsyncStorage.setItem(key, JSON.stringify(summary));

  // index
  const listKey = `match:summary:index`;
  const raw = (await AsyncStorage.getItem(listKey)) || '[]';
  const arr: string[] = JSON.parse(raw);
  if (!arr.includes(matchId)) {
    arr.unshift(matchId);
    await AsyncStorage.setItem(listKey, JSON.stringify(arr));
  }
  return summary;
}
