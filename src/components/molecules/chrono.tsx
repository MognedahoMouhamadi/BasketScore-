// src/components/molecules/Chrono.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text as RNText } from 'react-native';
import { Button } from '../atoms/button';
import { useTheme } from '../../theme/ThemeProvider';

export default function Chrono() {
  const { colors } = useTheme();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Met à jour le chrono chaque seconde quand il tourne
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleResume = () => setRunning(true);
  const handleRestart = () => {
    setElapsed(0);
    setRunning(false);
  };

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  const formatted = `${minutes}:${seconds}`;

  return (
    <View style={styles.container}>
      <RNText style={[styles.timerText, { color: colors.text }]}>
        {formatted}
      </RNText>
      {/* État initial : Start */}
      {!running && elapsed === 0 && (
        <Button
          title="START"
          bgColor={colors.start_button}
          textColor={colors.background}
          borderRadius={10}
          paddingVertical={10}
          paddingHorizontal={30}
          onPress={handleStart}
        />
      )}
      {/* En cours : Pause */}
      {running && (
        <Button
          title="PAUSE"
          bgColor={colors.accent}
          textColor={colors.text}
          borderRadius={10}
          paddingVertical={10}
          paddingHorizontal={30}
          onPress={handlePause}
        />
      )}
      {/* En pause (elapsed > 0) : Resume & Restart */}
      {!running && elapsed > 0 && (
        <View style={styles.buttonsRow}>
          <Button
            title="RESUME"
            bgColor={colors.start_button}
            textColor={colors.primary}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={20}
            onPress={handleResume}
          />
          <Button
            title="RESTART"
            bgColor={colors.primary}
            textColor={colors.text}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={20}
            onPress={handleRestart}
            style={{ marginLeft: 12 }}
          />

          <Button
            title="END"
            bgColor={colors.primary}
            textColor='#FF0000'
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={20}
            onPress={handleRestart}
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
