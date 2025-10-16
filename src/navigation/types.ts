// src/navigation/types.ts
export type TabsParamList = {
  Home: undefined;
  MatchHistory: undefined;
  PlayersDirectory: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  MatchSummary: { matchId: string };
};
