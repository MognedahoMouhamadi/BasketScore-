import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../atoms/text';
import { Icon } from '../atoms/Icon';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../atoms/button';
import Chrono from '../molecules/chrono';
import SwitchTeam from '../molecules/useTeam';


type HeaderProps = {
  title: string;
  showBack?: boolean;
  scoreA?: number;
  scoreB?: number;
};

export default function Header({ title, showBack = false, scoreA = 0, scoreB = 0 }: HeaderProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const TeamA = 'Team A';
  const TeamB = 'Team B';


  return (
    <View style={{ flex: 1, ...styles.container, backgroundColor: colors.primary }}>
     
      <View style={styles.team}>

          <View style={{ flex: 1 }}>
            
          <Text variant="title" style={{ color: colors.text }}>
          {TeamA}
          </Text>

          <Text>{scoreA}</Text>
          
          </View>


        <View style={{ flex: 1 }}>
        <Text variant="title" style={[styles.title, { color: colors.text }]}>
        {title}
        </Text>


        <View/>


        <Text variant="title" style={{ color: colors.text }}>
          {TeamB}
        </Text>

        <Text>{scoreB}</Text>
          
        </View>
        <View />

      </View>
      <Chrono />
      
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  team: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  }
});
