// src/screens/HomeScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Platform,
  Text,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

// adapte ces chemins à ta structure
import SwitchTeam from '../components/molecules/useTeam';
import PlayerCard, { Player } from '../components/molecules/playerCard';
import Header from '../components/organisms/Header';
import { usePersistentState } from '../hooks/useStorage';
import { useGameTimer, formatHMS } from '../hooks/useTime';
import Chrono from '../components/molecules/chrono';


export default function HomeScreen() {
  const { colors } = useTheme();

  // équipe affichée (A ou B)
  const [selectedTeam, setSelectedTeam] = usePersistentState<'A' | 'B'>('ui_selected_team', 'A');
  const { elapsedMs, start, pause, reset, isRunning } = useGameTimer('match_timer');  

  // listes vides au départ
  
  const [playersA, setPlayersA] = useState<Player[]>([]);
  const [playersB, setPlayersB] = useState<Player[]>([]);


  const [editingIndex, setEditingIndex] = useState<number | null>(null);
   const [tempName, setTempName] = useState('');



  /** Ajouter un joueur dans l'équipe choisie */
   const addPlayer = useCallback((team: 'A' | 'B', name: string) => {
    const safe = name?.trim() || `Joueur ${team}-${Date.now().toString().slice(-3)}`;
    if (team === 'A') setPlayersA(prev => [...prev, { name: safe, score: 0 }]);
    else setPlayersB(prev => [...prev, { name: safe, score: 0 }]);
  }, [setPlayersA, setPlayersB]);






  const onScore = useCallback((team: 'A' | 'B', index: number, points: number) => {
    if (team === 'A') setPlayersA(prev => prev.map((p,i) => i===index ? { ...p, score: p.score + points } : p));
    else setPlayersB(prev => prev.map((p,i) => i===index ? { ...p, score: p.score + points } : p));
  }, [setPlayersA, setPlayersB]);




const onEdit = (team: 'A' | 'B', index: number, newName: string) => {
  const name = newName.trim();
  if (!name) return;

  if (team === 'A') {
    setPlayersA(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name };
      return copy;
    });
  } else {
    setPlayersB(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name };
      return copy;
    });
  }
};

  const onDelete = useCallback((team: 'A' | 'B', index: number) => {
    if (team === 'A') setPlayersA(prev => prev.filter((_,i)=>i!==index));
    else setPlayersB(prev => prev.filter((_,i)=>i!==index));
  }, [setPlayersA, setPlayersB]);

  const onReset = () => {
  setPlayersA(prev => prev.map(p => ({ ...p, score: 0 })));
  setPlayersB(prev => prev.map(p => ({ ...p, score: 0 })));
  reset(); // <- la fonction reset() du chrono
};


  
  // Liste à afficher selon le switch
  const visiblePlayers = selectedTeam === 'A' ? playersA : playersB;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>

      <Header title="VS" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Sélecteur d'équipe */}
        <View style={styles.sectionHeader}>
          <SwitchTeam
            teamAName="Team A"
            teamBName="Team B"
            defaultTeam="A"
            onTeamChange={setSelectedTeam}
          />
        </View>

        {/* Petit résumé (optionnel) */}
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

        {/* Liste des joueurs de l'équipe sélectionnée */}
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
