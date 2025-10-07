import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook de persistance générique (clé/valeur) avec valeur par défaut.
 * Exemple :
 *   const [team, setTeam] = usePersistentState<'A' | 'B'>('ui_selected_team', 'A');
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  // 🔹 Charger la valeur sauvegardée au montage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved !== null) {
          // Si une valeur existe déjà, on la prend
          setValue(JSON.parse(saved));
        } else {
          // Sinon on initialise avec la valeur par défaut (utile si c’est “A”)
          await AsyncStorage.setItem(key, JSON.stringify(defaultValue));
          setValue(defaultValue);
        }
      } catch (e) {
        console.warn(`[usePersistentState] Erreur chargement ${key}`, e);
      } finally {
        setLoaded(true);
      }
    })();
  }, [key]);

  // 🔹 Fonction de mise à jour (écrit en mémoire et dans le state)
  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        setValue(newValue);
        await AsyncStorage.setItem(key, JSON.stringify(newValue));
      } catch (e) {
        console.warn(`[usePersistentState] Erreur sauvegarde ${key}`, e);
      }
    },
    [key]
  );

  // 🔹 Retourne la valeur par défaut tant que non chargée
  return [loaded ? value : defaultValue, updateValue];
}
