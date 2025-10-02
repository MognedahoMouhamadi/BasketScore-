import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";

type Match = {
  id: string;
  opponent: string;
  date: string;
  time: string;
};

type MatchListProps = {
  matches: Match[];
};

export default function MatchList({ matches }: MatchListProps) {
  return (
    <View style={styles.container}>
      {matches.map((match: Match) => (
        <View key={match.id} style={styles.matchItem}>
          <Text>{match.opponent}</Text>
          <Text>{match.date}</Text>
          <Text>{match.time}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  matchItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
});