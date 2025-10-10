import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../atoms/text';
import Chrono from '../molecules/chrono';
import type { Player } from '../molecules/playerCard';


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
  onRenameTeam?: (team: 'A'|'B') => void;
  onOpenMenu?: () => void;

};

export default function Header({
  title,
  scoreA = 0,
  scoreB = 0,
  teamAName = 'Team A',
  teamBName = 'Team B',
  elapsedMs,
  onEnd,
  isRunning,
  onStart,
  onPause,
  onRenameTeam,
  onRestart,
  onOpenMenu,
}: HeaderProps) {
  const { colors } = useTheme();
  // id + start conservés pour cette session d’affichage
  const matchId = useMemo(() => Date.now().toString(), []);
  const startedAt = useMemo(() => Date.now(), []);
  const MIN_DURATION_MS = 3000;

  return (
  <><View style={[styles.container, { backgroundColor: colors.primary }]}>

        {/* menu burger */}

        <View style={{ position: 'absolute', right: 12, top: 10 }}>
          <TouchableOpacity onPress={onOpenMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 20, color: colors.text }}>☰</Text>
          </TouchableOpacity>
        </View>
       <View style={styles.teamRow}>

        {/* gauche */}
        <View style={styles.colLeft}>
          <TouchableOpacity
            onPress={() => onRenameTeam?.('A')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            >
            <Text variant="title" style={{ color: colors.text }}>{teamAName}</Text>
            <Text style={{ color: colors.text, opacity: 0.7, marginLeft: 6 }}>✏️</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.text }}>{scoreA}</Text>
        </View>

        {/* centre */}
        <View style={styles.colCenter}>
          <Text variant="title" style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        {/* droite */}
        <View style={styles.colRight}>
          <TouchableOpacity
            onPress={() => onRenameTeam?.('B')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text variant="title" style={{ color: colors.text }}>{teamBName}</Text>
            <Text style={{ color: colors.text, opacity: 0.7, marginLeft: 6 }}>✏️</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.text }}>{scoreB}</Text>
        </View>
      </View>
      <View style={styles.chronoWrap}>
        {/* ✅ on passe bien la callback END au chrono */}
        <Chrono
          elapsedMs={elapsedMs}
          onEnd={onEnd}
          isRunning={isRunning}
          onStart={onStart}
          onPause={onPause}
          onRestart={onRestart} />
      </View>

    </View>
    
      </>
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
