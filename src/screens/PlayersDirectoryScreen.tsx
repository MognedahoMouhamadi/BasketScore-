// PlayerScreen.tsx
import React from 'react';
import { View, Text,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { Button } from '../components/atoms/button';
import { useNavigation } from '@react-navigation/native';



export default function PlayerScreen() {
   const navigation = useNavigation();

  return (
    // Replace this with your actual UI
          <SafeAreaView>
                <View style={{ marginBottom: 10 }}>
                  <Button title="⬅︎ Retour" onPress={() => navigation.goBack()} color={colors.primary} />
                </View>
            <Text>Paramètres</Text>
          </SafeAreaView>
  );
}