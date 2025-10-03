// src/screens/HomeScreen.tsx
import React, { useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import SwitchTeam from '../hooks/useTeam';
import PlayerCard, { Player } from '../components/molecules/playerCard';
import Header from '../components/organisms/Header';
import { usePersistentState } from '../hooks/useStorage';
import { useGameTimer } from '../hooks/useTime';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { colors } = useTheme();

  const [selectedTeam, setSelectedTeam] = usePersistentState<'A' | 'B'>('ui_selected_team', 'A');// sert à mémoriser la team sélectionnée
  const { reset } = useGameTimer('match_timer'); // hook pour gérer le timer de jeu

  // états persistants pour les joueurs des deux équipes

  const [playersA, setPlayersA] = usePersistentState<Player[]>('playersA', []);
  const [playersB, setPlayersB] = usePersistentState<Player[]>('playersB', []);

  const scoreA = useMemo(() => playersA.reduce((acc, p) => acc + p.score, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((acc, p) => acc + p.score, 0), [playersB]);

  const addPlayer = useCallback((team: 'A' | 'B', name: string) => {
    const safe = name?.trim() || `Joueur ${team}-${Date.now().toString().slice(-3)}`;
    team === 'A'
      ? setPlayersA(prev => [...prev, { name: safe, score: 0 }])
      : setPlayersB(prev => [...prev, { name: safe, score: 0 }]);
  }, [setPlayersA, setPlayersB]);

  const onScore = useCallback((team: 'A' | 'B', index: number, points: number) => {
    team === 'A'
      ? setPlayersA(prev => prev.map((p,i) => i===index ? { ...p, score: p.score + points } : p))
      : setPlayersB(prev => prev.map((p,i) => i===index ? { ...p, score: p.score + points } : p));
  }, [setPlayersA, setPlayersB]);

  const onEdit = useCallback((team: 'A' | 'B', index: number, newName: string) => {
    const name = newName.trim();
    if (!name) return;
    team === 'A'
      ? setPlayersA(prev => prev.map((p,i)=>i===index ? { ...p, name } : p))
      : setPlayersB(prev => prev.map((p,i)=>i===index ? { ...p, name } : p));
  }, [setPlayersA, setPlayersB]);

  const onDelete = useCallback((team: 'A' | 'B', index: number) => {
    team === 'A'
      ? setPlayersA(prev => prev.filter((_,i)=>i!==index))
      : setPlayersB(prev => prev.filter((_,i)=>i!==index));
  }, [setPlayersA, setPlayersB]);

  const onReset = () => {
    setPlayersA(prev => prev.map(p => ({ ...p, score: 0 })));
    setPlayersB(prev => prev.map(p => ({ ...p, score: 0 })));
    reset();
  };

  const visiblePlayers = selectedTeam === 'A' ? playersA : playersB;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Header title="VS" scoreA={scoreA} scoreB={scoreB} />

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
            onPress={onReset}
          >
            Remettre les scores à 0
          </Text>
        </View>

        <PlayerCard
          players={visiblePlayers}
          team={selectedTeam}
          onAdd={addPlayer}
          onScore={onScore}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {/* 👉 bouton manuel pour aller au bilan */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="Voir le dernier match"
            onPress={() =>
              navigation.navigate('MatchSummary', { matchId: 'dernier-id-sauvegardé' })
            }
          />
        </View>
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
