import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../components/atoms/button';
import { useTheme } from '../theme/ThemeProvider';

interface SwitchTeamProps {
  teamAName: string;
  teamBName: string;
  defaultTeam?: 'A' | 'B';
  onTeamChange?: (team: 'A' | 'B') => void;
}

function useTeam(defaultTeam: 'A' | 'B' = 'A') {
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>(defaultTeam);
  const isSelected = (team: 'A' | 'B') => selectedTeam === team;
  return { selectedTeam, setSelectedTeam, isSelected };
}

export function SwitchTeam({
  teamAName,
  teamBName,
  defaultTeam = 'A',
  onTeamChange,
}: SwitchTeamProps) {
  const { colors } = useTheme();
  const { selectedTeam, setSelectedTeam, isSelected } = useTeam(defaultTeam);

  const handleSelect = (team: 'A' | 'B') => {
    setSelectedTeam(team);
    if (onTeamChange) onTeamChange(team);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.gris }]}>
      <Button
        title={teamAName}
        bgColor={isSelected('A') ? colors.rose : colors.primary}
        textColor={isSelected('A') ? colors.primary : colors.text}
        borderRadius={10}
        paddingVertical={10}
        paddingHorizontal={24}
        onPress={() => handleSelect('A')}
      />
      <Button
        title={teamBName}
        bgColor={isSelected('B') ? colors.rose : colors.primary}
        textColor={isSelected('B') ? colors.primary : colors.text}
        borderRadius={10}
        paddingVertical={10}
        paddingHorizontal={24}
        onPress={() => handleSelect('B')}
      />
    </View>
  );
}

export default SwitchTeam;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
});
