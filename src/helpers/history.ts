// helpers/history.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadHistoryIds(): Promise<string[]> {
  const raw = (await AsyncStorage.getItem('match:summary:index')) || '[]';
  return JSON.parse(raw);
}

export async function loadSummary(matchId: string) {
  const raw = await AsyncStorage.getItem(`match:summary:${matchId}`);
  return raw ? JSON.parse(raw) : null;
}
