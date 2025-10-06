// src/screens/HomeScreen.tsx
import React, { useMemo, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Button } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import SwitchTeam from '../hooks/useTeam';
import PlayerCard from '../components/molecules/playerCard';
import Header from '../components/organisms/Header';
import { usePersistentState } from '../hooks/useStorage';
import { useGameTimer } from '../hooks/useTime';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayers } from '../hooks/usePlayers';
import { finalizeMatch } from '../helpers/FinalizerMatch';
import { newMatchId } from '../helpers/id';

type RootStackParamList = {
  Home: undefined;
  MatchSummary: { matchId: string };
  MatchHistory: undefined;
};

const MIN_DURATION_MS = 3000;

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  // A/B affichée
  const [selectedTeam, setSelectedTeam] =
    usePersistentState<'A' | 'B'>('ui_selected_team', 'A');

  // Timer (source unique)
  const { start, pause, reset, elapsedMs, isRunning } = useGameTimer('match_timer');

  // ID + début de match (fixés pour la session)
  const matchIdRef = useRef<string>(newMatchId());
  const startedAtRef = useRef<number>(Date.now());

  // Joueurs & scores (une seule source : le hook)
  const { playersA, playersB, addPlayer, onScore, onEdit, onDelete, resetScores } = usePlayers();



  const scoreA = useMemo(() => playersA.reduce((acc, p) => acc + p.score, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((acc, p) => acc + p.score, 0), [playersB]);

  const visiblePlayers = selectedTeam === 'A' ? playersA : playersB;

  // END: finaliser, sauver, nav
  const handleEnd = async () => {
  if (elapsedMs <= MIN_DURATION_MS) return;

  const matchId = matchIdRef.current;
  const startedAt = startedAtRef.current;

  await finalizeMatch({
    matchId,
    teamAName: 'Team A',
    teamBName: 'Team B',
    playersA,
    playersB,
    durationMs: elapsedMs,
    startedAt,
    endedAt: Date.now(),
  });

  navigation.navigate('MatchSummary', { matchId });
  reset();
  resetScores();
};

  // START
  const handleStart = () => {
    // si on part de 0 → nouveau match
    if (!isRunning && elapsedMs === 0) {
      matchIdRef.current = newMatchId();
      startedAtRef.current = Date.now();
    }
    start();
  };

  // RESTART
  const handleRestart = () => {
    reset();
    matchIdRef.current = newMatchId();
    startedAtRef.current = Date.now();
  };


  // Ouvrir le dernier bilan
  const openLastSummary = async () => {
    const lastId = await AsyncStorage.getItem('match:summary:last');
    if (!lastId) {
      console.log('Aucun match sauvegardé.');
      return;
    }
    navigation.navigate('MatchSummary', { matchId: lastId });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header
        title="VS"
        teamAName="Team A"
        teamBName="Team B"
        scoreA={scoreA}
        scoreB={scoreB}
        elapsedMs={elapsedMs}
        onEnd={handleEnd}
        isRunning={isRunning}
        onStart={handleStart}
        onPause={pause}
        onRestart={handleRestart}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.sectionHeader}>
          <SwitchTeam
            teamAName="Team A"
            teamBName="Team B"
            defaultTeam="A"
            onTeamChange={setSelectedTeam}
          />
        </View>

        <View style={[styles.summary, { backgroundColor: colors.gris }]}>
          <Text style={{ color: colors.text }}>
            Équipe affichée : {selectedTeam} • Joueurs : {visiblePlayers.length}
          </Text>
          <Text
            style={{ color: colors.rose, fontWeight: '700' }}
            onPress={() => {
              resetScores();
              reset();
            }}
          >
            Remettre les scores à 0
          </Text>
          <Button title="dernier match" onPress={openLastSummary} />
          <Button title="Historique" onPress={() => navigation.navigate('MatchHistory')} />
        </View>

        <PlayerCard
          players={visiblePlayers}
          team={selectedTeam}
          onAdd={addPlayer}
          onScore={onScore}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 24 },
  sectionHeader: { alignItems: 'center', marginBottom: 12 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});
