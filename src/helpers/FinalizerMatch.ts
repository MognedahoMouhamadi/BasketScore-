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

  // 1) clé unique
  await AsyncStorage.setItem(`match:summary:${matchId}`, JSON.stringify(summary));

  // 2) index d’historique (sans écraser)
  const idxKey = 'match:summary:index';
  const raw = (await AsyncStorage.getItem(idxKey)) || '[]';
  const ids: string[] = JSON.parse(raw);
  if (!ids.includes(matchId)) {
    ids.unshift(matchId); // dernier en premier
    await AsyncStorage.setItem(idxKey, JSON.stringify(ids));
  }

  // 3) pointeur “dernier”
  await AsyncStorage.setItem('match:summary:last', matchId);

  return summary;
}
