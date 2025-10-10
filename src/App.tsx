// App.tsx
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './theme/ThemeProvider';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayersDirectoryScreen';
import MatchSummaryScreen from './screens/MatchSummaryScreen';
import MatchHistoryScreen from './screens/matchHistoryScreen';
import PlayersDirectoryScreen from './screens/PlayersDirectoryScreen';
import SettingsScreen from './screens/SettingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer theme={DefaultTheme}>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }} 
          initialRouteName="Home"   // ✅ à ce niveau
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
          <Stack.Screen 
            name="MatchSummary" 
            component={MatchSummaryScreen} 
            options={{ title: 'Bilan du match' }} 
          />

          <Stack.Screen
            name="MatchHistory"
            component={MatchHistoryScreen}
            options={{ title: 'Historique des matchs', headerShown: true }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title:'Paramètres' }} />
          <Stack.Screen name="PlayersDirectory" component={PlayersDirectoryScreen} options={{ title:'Joueurs enregistrés' }} />






        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
