import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  initialValue: string;
  onCancel: () => void;
  onSave: (newName: string) => void;
  title?: string;
};

export default function TeamNameModal({ visible, initialValue, onCancel, onSave, title = 'Renommer l’équipe' }: Props) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Nom de l’équipe"
            maxLength={24}
            style={styles.input}
          />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.grey]} onPress={onCancel}>
              <Text>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.primary]}
              onPress={() => {
                const name = value.trim();
                if (!name) return;
                onSave(name);
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '86%', backgroundColor: 'white', borderRadius: 12, padding: 16 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  grey: { backgroundColor: '#eee' },
  primary: { backgroundColor: '#2563eb' },
});
