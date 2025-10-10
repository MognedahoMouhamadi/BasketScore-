import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type MenuSheetProps = {
  visible: boolean;
  onClose: () => void;
  onGoHistory: () => void;
  onGoSettings: () => void;
  onGoPlayers: () => void;
};

export default function MenuSheet({
  visible, onClose, onGoHistory, onGoSettings, onGoPlayers,
}: MenuSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.item} onPress={() => { onClose(); onGoHistory(); }}>
            <Text style={styles.itemText}>🕓 Historique des matchs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { onClose(); onGoPlayers(); }}>
            <Text style={styles.itemText}>👥 Joueurs enregistrés</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { onClose(); onGoSettings(); }}>
            <Text style={styles.itemText}>⚙️ Paramètres</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'flex-start', alignItems: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff', marginTop: 60, marginRight: 12,
    borderRadius: 12, paddingVertical: 6, width: 240,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
  },
  item: { paddingVertical: 12, paddingHorizontal: 14 },
  itemText: { fontSize: 16 },
});
