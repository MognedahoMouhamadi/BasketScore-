// components/PlayerList.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import PlayerCard, { Player } from './PlayerCard';

export default function PlayerList() {
  const [playersA, setPlayersA] = useState<Player[]>([
    { name: 'Alice', score: 0 },
    { name: 'Bob', score: 0 },
  ]);
  const [playersB, setPlayersB] = useState<Player[]>([
    { name: 'Charlie', score: 0 },
    { name: 'David', score: 0 },
  ]);

  const handleScore = (team: 'A' | 'B', index: number, points: number) => {
    if (team === 'A') {
      const updated = [...playersA];
      updated[index] = { ...updated[index], score: updated[index].score + points };
      setPlayersA(updated);
    } else {
      const updated = [...playersB];
      updated[index] = { ...updated[index], score: updated[index].score + points };
      setPlayersB(updated);
    }
  };

  const handleEdit = (team: 'A' | 'B', index: number, newName: string) => {
    if (!newName?.trim()) return;
    if (team === 'A') {
      const updated = [...playersA];
      updated[index] = { ...updated[index], name: newName.trim() };
      setPlayersA(updated);
    } else {
      const updated = [...playersB];
      updated[index] = { ...updated[index], name: newName.trim() };
      setPlayersB(updated);
    }
  };

  const handleDelete = (team: 'A' | 'B', index: number) => {
    if (team === 'A') setPlayersA(prev => prev.filter((_, i) => i !== index));
    else setPlayersB(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <PlayerCard
        players={playersA}
        team="A"
        onScore={handleScore}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PlayerCard
        players={playersB}
        team="B"
        onScore={handleScore}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );
}
