import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Button } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import SwitchTeam from '../hooks/useTeam';
import PlayerCard from '../components/molecules/playerCard';
import Header from '../components/organisms/Header';
import { usePersistentState } from '../hooks/useStorage';
import { useGameTimer } from '../hooks/useTime';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  MatchSummary: { matchId: string };
};


import { usePlayers } from '../hooks/usePlayers';

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [selectedTeam, setSelectedTeam] = usePersistentState<'A' | 'B'>('ui_selected_team', 'A');
  const { reset, elapsedMs } = useGameTimer('match_timer');

  // ✅ tout vient du hook
  const { playersA, playersB, addPlayer, onScore, onEdit, onDelete, resetScores } = usePlayers();

  const scoreA = useMemo(() => playersA.reduce((acc, p) => acc + p.score, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((acc, p) => acc + p.score, 0), [playersB]);

  const visiblePlayers = selectedTeam === 'A' ? playersA : playersB;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
    <Header
        title="VS"
        teamAName="Team A"
        teamBName="Team B"
        scoreA={scoreA}
        scoreB={scoreB}
        playersA={playersA}
        playersB={playersB}
        elapsedMs={elapsedMs}
        onNavigateToSummary={(id) => navigation.navigate('MatchSummary', { matchId: id })}
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
          <Text style={{ color: colors.rose, fontWeight: '700' }} onPress={() => { resetScores(); reset(); }}>
            Remettre les scores à 0
          </Text>
          <Button title="Voir le dernier match" onPress={() => navigation.navigate('MatchSummary', { matchId: 'dernier' })} />
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
