// src/screens/HomeScreen.tsx
import React, { useMemo, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Button } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import SwitchTeam from '../hooks/useTeam';
import PlayerCard from '../components/molecules/playerCard';
import TeamNameModal from '../components/molecules/teamNameModal';
import Header from '../components/organisms/Header';
import { usePersistentState } from '../hooks/useStorage';
import { useGameTimer } from '../hooks/useTime';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayers } from '../hooks/usePlayers';

import { useMatchLogic } from '../hooks/useMatchLogic';
import { useTeamNames } from '../hooks/useTeamName';
import { on } from 'events';

type RootStackParamList = {
  Home: undefined;
  MatchSummary: { matchId: string };
  MatchHistory: undefined;
};

export const MIN_DURATION_MS = 3000;

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  // A/B affichée
  const [selectedTeam, setSelectedTeam] =
    usePersistentState<'A' | 'B'>('ui_selected_team', 'A');

  // Noms des équipes (persistés), pour l’instant fixes mais modifiables plus tard

const {
    teamAName,
    teamBName,
    renameOpen,
    openRename,
    closeRename,
    saveRename,
  } = useTeamNames(); // Hook personnalisé pour gérer les noms des équipes

// Timer (source unique)
const { start, pause, reset, elapsedMs, isRunning } = useGameTimer('match_timer');

// Joueurs & scores (une seule source : le hook)
const { playersA, playersB, addPlayer, onScore, onEdit, onDelete, resetScores } = usePlayers();

const { matchIdRef, handleStart, handleRestartSeed, handleEnd } = useMatchLogic({
  elapsedMs,
  teamAName,
  teamBName,
  playersA,
  playersB,
  onSaved: (id) => {
    // navigation + nettoyage côté écran
    navigation.navigate('MatchSummary', { matchId: id });
    reset();
    resetScores();
  },
});

const onStart = () => { handleStart(); start(); };
const onRestart = () => { handleRestartSeed(); reset(); };

// ID + début de match (fixés pour la session)
  const scoreA = useMemo(() => playersA.reduce((acc, p) => acc + p.score, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((acc, p) => acc + p.score, 0), [playersB]);

  const visiblePlayers = selectedTeam === 'A' ? playersA : playersB;
  // Finir le match, sauvegarder, puis naviguer
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
        teamAName={teamAName}
        teamBName={teamBName}
        scoreA={scoreA}
        scoreB={scoreB}
        elapsedMs={elapsedMs}
        onEnd={handleEnd}
        isRunning={isRunning}
        onStart={onStart}
        onPause={pause}
        onRestart={onRestart}
        onRenameTeam={(t) => openRename(t)}   // 👈 (voir modal ci-dessous)
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.sectionHeader}>
          <SwitchTeam
            teamAName={teamAName}
            teamBName={teamBName}
            value={selectedTeam}
            onChange={setSelectedTeam}
          />
        </View>

        <View style={[styles.summary, { backgroundColor: colors.gris }]}>
          <Text style={{ color: colors.text }}>
            Team: {selectedTeam} • Nb jrs : {visiblePlayers.length}
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

        {/* à mettre dans un écran menu */}

        </View>

        <PlayerCard
          players={visiblePlayers}
          team={selectedTeam}
          onAdd={addPlayer}
          onScore={onScore}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <TeamNameModal
          visible={renameOpen.open}
          initialValue={renameOpen.team === 'A' ? teamAName : teamBName}
          onCancel={closeRename}
          onSave={saveRename}
          title={renameOpen.team === 'A' ? "Renommer l'équipe A" : "Renommer l'équipe B"}
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
