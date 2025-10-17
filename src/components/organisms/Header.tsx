import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../atoms/text';
import { formatMMSS } from '../../hooks/useTime';
import Chrono from '../molecules/chrono';

type Props = {
  teamAName?: string;
  teamBName?: string;
  scoreA?: number;
  scoreB?: number;
  elapsedMs: number;
  isRunning?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
  onEnd?: () => void;
  onRenameTeam?: (t: 'A'|'B') => void;
};

export default function Header({
  teamAName='McDo',
  teamBName='Bking',
  scoreA=0,
  scoreB=0,
  elapsedMs,
  isRunning,
  onStart,
  onPause,
  onRestart,
  onRenameTeam,
  onEnd,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const timerLabel = useMemo(() => formatMMSS(elapsedMs), [elapsedMs]);

  const handlePrimary = () => {
    if (isRunning) onPause?.();
    else onStart?.();
  };

  const primaryLabel = isRunning ? 'PAUSE' : elapsedMs > 0 ? 'RESUME' : 'START';

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        {/* Left side */}
        <View style={styles.side}>
          <TouchableOpacity onPress={() => onRenameTeam?.('A')} activeOpacity={0.7} style={styles.teamBtn}>
            <Text style={[styles.teamName, { color: colors.text }]}>{teamAName}</Text>
            <Text style={{ color: colors.text, opacity: 0.8, marginLeft: 6 }}>✏️</Text>
          </TouchableOpacity>
        </View>

    

        {/* Center chrono */}
        <View style={styles.center}>
              {/* Score A */}
          <Text style={[styles.scoreText, { color: colors.secondary }]}>{scoreA}</Text>
          <Chrono
            elapsedMs={elapsedMs}
            isRunning={isRunning}
            onStart={onStart}
            onPause={onPause}
            onRestart={onRestart}
            showControls={true}
            onEnd={onEnd}
          />
          {/* Score B */}
          <Text style={[styles.scoreText, { color: colors.accent }]}>{scoreB}</Text>
       
        </View>

        
     


        {/* Right side */}
        <View style={[styles.side, { alignItems: 'flex-end' }]}>
          <TouchableOpacity onPress={() => onRenameTeam?.('B')} activeOpacity={0.7} style={styles.teamBtn}>
            <Text style={[styles.teamName, { color: colors.text }]}>{teamBName}</Text>
            <Text style={{ color: colors.text, opacity: 0.8, marginLeft: 6 }}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { width: '100%' },
  container: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
    // léger effet carte
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  side: { flex: 1, justifyContent: 'center' },
  teamBtn: { flexDirection: 'row', alignItems: 'center' },
  teamName: { fontSize: 18, fontWeight: '600', letterSpacing: 0.2 },

  scoreBox: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: { fontSize: 32, fontWeight: '800' },

  center: { width: 200, alignItems: 'center', justifyContent: 'center', rowGap: 6, flexDirection: 'row', },
  timerBox: {
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  timerText: { fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },

  primaryBtn: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
});
