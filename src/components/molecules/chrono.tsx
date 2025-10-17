// src/components/molecules/Chrono.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text as RNText } from 'react-native';
import { Button } from '../atoms/button';
import { useTheme } from '../../theme/ThemeProvider';
import { formatHMS } from '../../hooks/useTime';

type ChronoProps = {
  elapsedMs?: number;
  onEnd?: () => void;
  isRunning?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
};

export default function Chrono({ onEnd, elapsedMs: elapsedMs, onStart, onPause, onRestart, isRunning }: ChronoProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <RNText style={styles.timerText}>{formatHMS(elapsedMs ?? 0)}</RNText>
      {/* État initial : Start */}
      {!isRunning && elapsedMs === 0 && (
        <Button
          title="START"
          bgColor={colors.start_button}
          textColor={colors.background}
          borderRadius={10}
          paddingVertical={10}
          paddingHorizontal={30}
          onPress={onStart}
        />
      )}
      {/* En cours : Pause */}
      {isRunning && (
        <Button
          title="PAUSE"
          bgColor={colors.accent}
          textColor={colors.text}
          borderRadius={10}
          paddingVertical={10}
          paddingHorizontal={30}
          onPress={onPause}
        />
      )}
      {/* En pause (elapsed > 0) : Resume & Restart */}
      {!isRunning && (elapsedMs ?? 0) > 0 && (
        <View style={styles.buttonsRow}>
          <Button
            title="RESUME"
            bgColor={colors.start_button}
            textColor={colors.primary}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={20}
            onPress={onStart}
          />
          <Button
            title="RESTART"
            bgColor={colors.primary}
            textColor={colors.text}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={20}
            onPress={onRestart}
            style={{ marginLeft: 12 }}
          />

          <Button
            title="END"
            bgColor={colors.primary}
            textColor='#FF0000'
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={20}
            onPress={onEnd}
            disabled={(elapsedMs ?? 0) <= 3} // c'est bien 3s minimum
            style={{ marginLeft: 12 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
