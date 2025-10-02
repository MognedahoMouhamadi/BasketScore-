import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../atoms/text';
import Chrono from '../molecules/chrono';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  // score?: number; // si tu veux des scores dynamiques, passe-les en props séparées
  scoreA?: number;
  scoreB?: number;
};

export default function Header({ title, showBack = false, scoreA = 0, scoreB = 0 }: HeaderProps) {
  const { colors } = useTheme();
  const TeamA = 'Team A';
  const TeamB = 'Team B';

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Ligne équipes */}
      <View style={styles.teamRow}>
        {/* Colonne gauche */}
        <View style={styles.colLeft}>
          <Text variant="title" style={{ color: colors.text }}>{TeamA}</Text>
          <Text style={{ color: colors.text }}>{scoreA}</Text>

          {/* je veux ajouter une image ici plus tard */}
          <View style={{ height: 24, borderRadius: 12, backgroundColor: colors.rose }} />
          {/* <Image source={require('../../assets/teamA.png')} style={{ width: 24, height: 24 }} /> */}
        </View>

        {/* Colonne centre */}
        <View style={styles.colCenter}>
          <Text variant="title" style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        {/* Colonne droite */}
        <View style={styles.colRight}>
          <Text variant="title" style={{ color: colors.text }}>{TeamB}</Text>
          <Text style={{ color: colors.text }}>{scoreB}</Text>

          {/* je veux ajouter une image ici plus tard */}
          <View style={{ height: 24, borderRadius: 12, backgroundColor: colors.rose }} />
          {/* <Image source={require('../../assets/teamA.png')} style={{ width: 24, height: 24 }} /> */}
        </View>
         
      </View>

      {/* Chrono centré */}
      <View style={styles.chronoWrap}>
        <Chrono />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ⚠️ ne mets pas flex:1 ici, sinon le header prend toute la page
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },

  teamRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },

  colLeft: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  colCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  colRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  chronoWrap: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
});
