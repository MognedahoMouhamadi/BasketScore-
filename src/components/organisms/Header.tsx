import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../atoms/text';
import Chrono from '../molecules/chrono';
import { finalizeMatch } from './../../helpers/FinalizerMatch';
import type { Player } from '../molecules/playerCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  scoreA?: number;
  scoreB?: number;
  teamAName?: string;
  teamBName?: string;
  playersA?: Player[];
  playersB?: Player[];
  // 👉 passe le temps écoulé depuis le parent (même source que ton chrono)
  elapsedMs: number;
  // 👉 optionnel: navigation après END
  onNavigateToSummary?: (matchId: string) => void;

  onEnd?: () => void; // Callback when the match ends
  isRunning?: boolean; // Indicates if the timer is running
  onStart?: () => void; // Callback when the timer starts
  onPause?: () => void; // Callback when the timer is paused
  onRestart?: () => void; // Callback when the timer restarts


};

export default function Header({
  title,
  showBack = false,
  scoreA = 0,
  scoreB = 0,
  teamAName = 'Team A',
  teamBName = 'Team B',
  playersA = [],
  playersB = [],
  elapsedMs,
  onNavigateToSummary,
}: HeaderProps) {
  const { colors } = useTheme();
  // id + start conservés pour cette session d’affichage
  const matchId = useMemo(() => Date.now().toString(), []);
  const startedAt = useMemo(() => Date.now(), []);
  const MIN_DURATION_MS = 3000;

  const onEnd = async () => {
  if (elapsedMs <= 3000) return; // 3s mini
  const endedAt = Date.now();
  console.log('le bouton END a été pressé', { elapsedMs, startedAt, endedAt });
  await finalizeMatch({
    matchId,
    teamAName,
    teamBName,
    playersA,
    playersB,
    durationMs: elapsedMs,
    startedAt,
    endedAt,
  });

  // ✅ mémorise l’ID du dernier match
  await AsyncStorage.setItem('match:summary:last', matchId);

  onNavigateToSummary?.(matchId); // ✅ navigue avec le VRAI id
  console.log('[Header] Match finalisé', matchId);
  elapsedMs = 0; // reset elapsedMs after finalizing the match
  console.log('elapsedMs reset to 0 after finalizing the match')
};


  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.teamRow}>
        <View style={styles.colLeft}>
          <Text variant="title" style={{ color: colors.text }}>{teamAName}</Text>
          <Text style={{ color: colors.text }}>{scoreA}</Text>
          <View style={{ height: 24, borderRadius: 12, backgroundColor: colors.rose }} />
        </View>

        <View style={styles.colCenter}>
          <Text variant="title" style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.colRight}>
          <Text variant="title" style={{ color: colors.text }}>{teamBName}</Text>
          <Text style={{ color: colors.text }}>{scoreB}</Text>
          <View style={{ height: 24, borderRadius: 12, backgroundColor: colors.rose }} />
        </View>
      </View>

      <View style={styles.chronoWrap}>
        {/* ✅ on passe bien la callback END au chrono */}
        <Chrono onEnd={onEnd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    margin: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  colLeft: { flex: 1, alignItems: 'flex-start', gap: 4 },
  colCenter: { flex: 1, alignItems: 'center' },
  colRight: { flex: 1, alignItems: 'flex-end', gap: 4 },
  title: { fontWeight: 'bold', fontSize: 20 },
  chronoWrap: { width: '100%', alignItems: 'center', marginTop: 6 },
});
