// screens/MatchSummaryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../components/atoms/button';
import { SafeAreaView } from 'react-native-safe-area-context';

type Player = { name: string; points: number };
type MatchSummary = {
  id: string;
  teamAName: string; teamBName: string;
  playersA: Player[]; playersB: Player[];
  scoreA: number; scoreB: number;
  durationMs: number;
  startedAt: number; endedAt: number;
};

const formatMMSS = (ms: number) => {
  const t = Math.floor(ms / 1000);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

export default function MatchSummaryScreen() {
  const { colors } = useTheme();
  const nav = useNavigation();
  const { params } = useRoute() as { params: { matchId: string } };

  const [summary, setSummary] = useState<MatchSummary | null>(null);

  useEffect(() => {
  (async () => {
    const key = `match:summary:${params.matchId}`;
    const raw = await AsyncStorage.getItem(key);
    console.log('[Summary] load', key, !!raw);
    if (raw) setSummary(JSON.parse(raw));
  })();
}, [params.matchId]);


if (!summary) {
  return (
    <SafeAreaView style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Aucun bilan trouvé pour ce match.</Text>
      <Button title="Retour" onPress={() => nav.goBack()} />
    </SafeAreaView>
  );
}


  // ... après les imports et useEffect qui charge summary
if (!summary) {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ marginBottom: 12, textAlign: 'center' }}>
        Aucun bilan trouvé pour ce match.
      </Text>
      <Button title="⬅︎ Retour" onPress={() => nav.goBack()} />
    </SafeAreaView>
  );
}
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={{ marginBottom: 10 }}>
        <Button title="⬅︎ Retour" onPress={() => nav.goBack()} bgColor={colors.primary} textColor={colors.text} borderRadius={10} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {summary.teamAName} {summary.scoreA} — {summary.scoreB} {summary.teamBName}
        </Text>
        <Text style={{ color: colors.text, opacity: 0.8 }}>
          Durée : {formatMMSS(summary.durationMs)}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: colors.primary, flex: 1 }]}>
          <Text style={[styles.subtitle, { color: colors.text }]}>{summary.teamAName}</Text>
          <FlatList
            data={summary.playersA}
            keyExtractor={(it, i) => `A-${i}`}
            renderItem={({ item }) => (
              <View style={styles.playerRow}>
                <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={[styles.playerPts, { color: colors.text }]}>{item.points}</Text>
              </View>
            )}
          />
        </View>

        <View style={{ width: 12 }} />

        <View style={[styles.card, { backgroundColor: colors.primary, flex: 1 }]}>
          <Text style={[styles.subtitle, { color: colors.text }]}>{summary.teamBName}</Text>
          <FlatList
            data={summary.playersB}
            keyExtractor={(it, i) => `B-${i}`}
            renderItem={({ item }) => (
              <View style={styles.playerRow}>
                <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={[styles.playerPts, { color: colors.text }]}>{item.points}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 16, gap: 12 },
  card: {
    borderRadius: 14, padding: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  row: { flexDirection: 'row' },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  playerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#00000012' },
  playerName: { flex: 1, minWidth: 0 },
  playerPts: { width: 36, textAlign: 'right', fontWeight: '700' },
});
