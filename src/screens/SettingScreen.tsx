import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme';
import { Button } from '../components/atoms/button';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
        <SafeAreaView>
              <View style={{ marginBottom: 10 }}>
                <Button title="⬅︎ Retour" onPress={() => navigation.goBack()} color={colors.primary} />
              </View>
          <Text>Paramètres</Text>
        </SafeAreaView>
  );
}