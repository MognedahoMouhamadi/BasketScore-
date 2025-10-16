// App.tsx
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './theme/ThemeProvider';

import BottomTabs from './navigation/BottomTabs';
import MatchSummaryScreen from './screens/MatchSummaryScreen';

const Stack = createStackNavigator(); // tu peux garder stack ou passer à native-stack

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer theme={DefaultTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
          {/* Racine = Tabs */}
          <Stack.Screen name="Tabs" component={BottomTabs} />

          {/* Écrans au-dessus des onglets */}
          <Stack.Screen
            name="MatchSummary"
            component={MatchSummaryScreen}
            options={{ headerShown: true, title: 'Bilan du match' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
