// src/hooks/usePlayers.ts
import { useState, useCallback } from 'react';

export type Player = { name: string; score: number };

export function usePlayers() {
  const [playersA, setPlayersA] = useState<Player[]>([]);
  const [playersB, setPlayersB] = useState<Player[]>([]);

  const addPlayer = useCallback((team: 'A' | 'B', name?: string) => {
    const safe = name?.trim() || `Joueur ${team}-${Date.now().toString().slice(-3)}`;
    if (team === 'A') setPlayersA(prev => [...prev, { name: safe, score: 0 }]);
    else setPlayersB(prev => [...prev, { name: safe, score: 0 }]);
  }, []);

  const onScore = useCallback((team: 'A' | 'B', index: number, points: number) => {
    if (team === 'A') {
      setPlayersA(prev =>
        prev.map((p, i) => i === index ? { ...p, score: p.score + points } : p)
      );
    } else {
      setPlayersB(prev =>
        prev.map((p, i) => i === index ? { ...p, score: p.score + points } : p)
      );
    }
  }, []);

  const onEdit = useCallback((team: 'A' | 'B', index: number, newName: string) => {
    const name = newName.trim();
    if (!name) return;

    if (team === 'A') {
      setPlayersA(prev => prev.map((p, i) => i === index ? { ...p, name } : p));
    } else {
      setPlayersB(prev => prev.map((p, i) => i === index ? { ...p, name } : p));
    }
  }, []);

  const onDelete = useCallback((team: 'A' | 'B', index: number) => {
    if (team === 'A') setPlayersA(prev => prev.filter((_, i) => i !== index));
    else setPlayersB(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetScores = useCallback(() => {
    setPlayersA(prev => prev.map(p => ({ ...p, score: 0 })));
    setPlayersB(prev => prev.map(p => ({ ...p, score: 0 })));
  }, []);

  return {
    playersA, playersB,
    addPlayer, onScore, onEdit, onDelete, resetScores
  };
}
