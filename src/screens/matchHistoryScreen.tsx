import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { formatMMSS } from '../hooks/useTime';

type RootStackParamList = {
  Home: undefined;
  MatchSummary: { matchId: string };
  MatchHistory: undefined;
};

type Summary = {
  id: string;
  teamAName: string;
  teamBName: string;
  playersA: { name: string; points: number }[];
  playersB: { name: string; points: number }[];
  scoreA: number;
  scoreB: number;
  durationMs: number;
  startedAt: number;
  endedAt: number;
};

export default function MatchHistoryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<Summary[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadIds = useCallback(async () => {
    const raw = (await AsyncStorage.getItem('match:summary:index')) || '[]';
    setIds(JSON.parse(raw));
  }, []);

  const loadSummaries = useCallback(async (allIds: string[]) => {
    const results: Summary[] = [];
    for (const id of allIds) {
      const raw = await AsyncStorage.getItem(`match:summary:${id}`);
      if (raw) results.push(JSON.parse(raw));
    }
    setItems(results);
  }, []);

  const reload = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadIds();
    } finally {
      setRefreshing(false);
    }
  }, [loadIds]);

  // recharge à l’arrivée sur l’écran
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  // quand les ids changent, recharge les summaries
  useEffect(() => {
    if (ids.length) loadSummaries(ids);
    else setItems([]);
  }, [ids, loadSummaries]);

  const renderItem = ({ item }: { item: Summary }) => {
    const date = new Date(item.endedAt || item.startedAt);
    const dateLabel = date.toLocaleString();
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('MatchSummary', { matchId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.rowTop}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.teamAName} {item.scoreA} — {item.scoreB} {item.teamBName}
          </Text>
          <Text style={{ color: colors.text, opacity: 0.7 }}>{formatMMSS(item.durationMs)}</Text>
        </View>

        <View style={styles.rowBottom}>
          <Text style={{ color: colors.text, opacity: 0.8 }}>{dateLabel}</Text>
          <Text style={{ color: colors.text, opacity: 0.7 }}>
            {item.playersA.length + item.playersB.length} joueurs
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={colors.text} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: colors.text, opacity: 0.8, textAlign: 'center' }}>
              Aucun match sauvegardé pour le moment.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  listContent: { padding: 12 },
  card: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBottom: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
