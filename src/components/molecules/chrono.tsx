// components/molecules/chrono.tsx
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../atoms/text';
import { Button } from '../atoms/button';
import { formatMMSS } from '../../hooks/useTime';

type ChronoProps = {
  elapsedMs: number;
  isRunning?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
  onEnd?: () => void;
  showControls?: boolean;      // ← true dans le header
};

const MIN_END_MS = 3000;

export default function Chrono({
  elapsedMs,
  isRunning,
  onStart,
  onPause,
  onRestart,
  onEnd,
  showControls = true,
}: ChronoProps) {
  const { colors } = useTheme();
  const label = useMemo(() => formatMMSS(elapsedMs), [elapsedMs]);
  const canEnd = elapsedMs >= MIN_END_MS;

  const primaryLabel = isRunning ? 'PAUSE' : elapsedMs > 0 ? 'RESUME' : 'START';
  const onPrimary = isRunning ? onPause : onStart;

  return (
    <View style={[styles.wrap, showControls && styles.wrapWithControls]}>
      <Text style={[styles.time, { color: colors.text }]}>{label}</Text>

      {showControls && (
        <View style={styles.btnRow}>
          <Button
            title={primaryLabel}
            bgColor={colors.start_button}
            textColor={colors.text}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={24}
            onPress={onPrimary}
          />

          <Button
            title="RESTART"
            bgColor={colors.primary}
            textColor={colors.text}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={22}
            onPress={onRestart}
            style={{ marginLeft: 10, borderWidth: 1, borderColor: colors.border }}
          />

          <Button
            title="END"
            bgColor={colors.primary}
            textColor={colors.rouge}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={22}
            onPress={onEnd}
            disabled={!canEnd}
            style={{ marginLeft: 10, opacity: canEnd ? 1 : 0.5, borderWidth: 1, borderColor: colors.border }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  // réserve de la place verticale quand les boutons sont visibles → plus de chevauchement
  wrapWithControls: { minHeight: 78 },
  time: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
