// src/hooks/useTeam.tsx (ou components/molecules/SwitchTeam.tsx)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../components/atoms/button';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  value: 'A' | 'B';                     // 👈 état vient du parent
  onChange: (team: 'A' | 'B') => void;  // 👈 parent met à jour
  teamAName?: string;
  teamBName?: string;
};

export default function SwitchTeam({ value, onChange, teamAName='Team A', teamBName='Team B' }: Props) {
  const { colors } = useTheme();
  const isA = value === 'A';
  const isB = value === 'B';

  return (
    <View style={styles.container}>
      <Button
        title={teamAName}
        bgColor={isA ? colors.rose : colors.primary}
        textColor={isA ? colors.primary : colors.text}
        borderRadius={10}
        paddingVertical={10}
        paddingHorizontal={30}
        onPress={() => onChange('A')}
      />
      <Button
        title={teamBName}
        bgColor={isB ? colors.rose : colors.primary}
        textColor={isB ? colors.primary : colors.text}
        borderRadius={10}
        paddingVertical={10}
        paddingHorizontal={30}
        onPress={() => onChange('B')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: 6, borderRadius: 12,
  },
});
