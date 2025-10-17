// src/navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MatchHistoryScreen from '../screens/matchHistoryScreen';
import PlayersDirectoryScreen from '../screens/PlayersDirectoryScreen';
import SettingsScreen from '../screens/SettingScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#242422',
          borderColor: 'transparent',
          position: 'absolute',
          left: 20,
          right: 20,
          alignItems: 'center',
        },
 
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            MatchHistory: 'time',
            PlayersDirectory: 'people',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="MatchHistory" component={MatchHistoryScreen} options={{ title: 'Historique' }} />
      <Tab.Screen name="PlayersDirectory" component={PlayersDirectoryScreen} options={{ title: 'Joueurs' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
    </Tab.Navigator>
  );
}


