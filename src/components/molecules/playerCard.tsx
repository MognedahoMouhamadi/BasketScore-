// components/PlayerCard.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  Modal, TextInput
} from 'react-native';
import { Button } from '../atoms/button';
import { colors } from '../../theme';

export interface Player { name: string; score: number; }

interface PlayerCardProps {
  players: Player[];
  team: 'A' | 'B';
  onAdd: (team: 'A' | 'B', name: string) => void;
  onScore: (team: 'A' | 'B', index: number, points: number) => void;
  onEdit: (team: 'A' | 'B', index: number, newName: string) => void;
  onDelete: (team: 'A' | 'B', index: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  players, team, onAdd, onScore, onEdit, onDelete
}) => {
  // état local pour l’édition
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');

  const openEdit = (index: number, current: string) => {
    setEditingIndex(index);
    setTempName(current);
  };
  const cancelEdit = () => {
    setEditingIndex(null);
    setTempName('');
  };
  const saveEdit = () => {
    if (editingIndex === null) return;
    const name = tempName.trim();
    if (!name) return;
    onEdit(team, editingIndex, name); // ✅ maintenant on envoie le NOUVEAU nom
    cancelEdit();
  };

  return (
    <>
      <FlatList
        data={players}
        extraData={players} // ✅ force le rerender quand le nom change
        keyExtractor={(_, index) => `${team}-${index}`}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Équipe {team}</Text>
            <Button
              title="+ Ajouter"
              bgColor={colors.verte}
              textColor="#fff"
              paddingHorizontal={12}
              paddingVertical={8}
              borderRadius={8}
              onPress={() => onAdd(team, '')}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aucun joueur dans l’équipe {team}</Text>
            <Button
              title="Ajouter un joueur"
              bgColor={colors.accent}
              textColor="#fff"
              paddingHorizontal={14}
              paddingVertical={10}
              borderRadius={10}
              onPress={() => onAdd(team, '')}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.playerRow}>
              <View style={styles.nameWrap}>
                <Text
                  style={styles.playerName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>

              </View>
            <Text style={styles.playerScore}>{item.score}</Text>

            <View style={styles.pointsRow}>
              <Button title="" onPress={() => onScore(team, index, 1)}
                bgColor={colors.verte} paddingHorizontal={10} borderRadius={5}
                style={{ marginHorizontal: 2 }} />
              <Button title="" onPress={() => onScore(team, index, 2)}
                bgColor={colors.accent} paddingHorizontal={10} borderRadius={5}
                style={{ marginHorizontal: 2 }} />
              <Button title="" onPress={() => onScore(team, index, 3)}
                bgColor={colors.violet} paddingHorizontal={10} borderRadius={5}
                style={{ marginHorizontal: 2 }} />
              <Button title="" onPress={() => onScore(team, index, 4)}
                bgColor={colors.rouge} paddingHorizontal={10} borderRadius={5}
                style={{ marginHorizontal: 2 }} />
            </View>

            <View style={styles.actionsRow}>
              {/* ✅ ouvre le modal d’édition */}
              <TouchableOpacity onPress={() => openEdit(index, item.name)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(team, index)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ✅ Modal d'édition cross-platform */}
      <Modal visible={editingIndex !== null} transparent animationType="fade" onRequestClose={cancelEdit}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Modifier le nom</Text>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Nom du joueur"
              placeholderTextColor="#999"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveEdit}
            />
            <View style={styles.modalActions}>
              <Button title="Annuler" onPress={cancelEdit}
                bgColor="#ddd" textColor="#222" borderRadius={8}
                paddingHorizontal={12} paddingVertical={8} />
              <View style={{ width: 8 }} />
              <Button title="Enregistrer" onPress={saveEdit}
                bgColor={colors.verte} textColor="#fff" borderRadius={8}
                paddingHorizontal={12} paddingVertical={8} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PlayerCard;

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  headerTitle: { fontSize: 16, fontWeight: '700' },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  emptyText: { marginBottom: 8, color: '#666' },

  playerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8,
  },
  playerName: { flex: 1, fontSize: 16 },
  playerScore: { width: 30, textAlign: 'center', fontWeight: 'bold' },
  pointsRow: { flexDirection: 'row', marginHorizontal: 8 },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  edit: { fontSize: 18, marginHorizontal: 6 },
  delete: { fontSize: 18, marginHorizontal: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#222',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  nameWrap: {
    flex: 1,
    minWidth: 0,          // crucial pour que Text puisse ellipser
    marginRight: 6,
  },










});