// hooks/useGameTimer.ts
import { useEffect, useRef, useMemo, useState } from 'react';
import { usePersistentState } from './useStorage';

type TimerState = {
  isRunning: boolean;
  startedAt: number | null;
  accumulatedMs: number;
};

export function useGameTimer(storageKey = 'game_timer') {
  const [state, setState] = usePersistentState<TimerState>(storageKey, {
    isRunning: false,
    startedAt: null,
    accumulatedMs: 0,
  });

  // ⚠️ ce ref stocke un setInterval, pas un RAF
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ tick local pour re-render sans réécrire dans le storage
  const [, force] = useState(0);

  const elapsedMs = useMemo(() => {
    if (!state.isRunning || state.startedAt == null) return state.accumulatedMs;
    return state.accumulatedMs + (Date.now() - state.startedAt);
  }, [state]);

  const start = () => {
    if (state.isRunning) return;
    setState(s => ({ ...s, isRunning: true, startedAt: Date.now() }));
  };

  const pause = () => {
    if (!state.isRunning || state.startedAt == null) return;
    const now = Date.now();
    setState(s => ({
      isRunning: false,
      startedAt: null,
      accumulatedMs: s.accumulatedMs + (now - s.startedAt!),
    }));
  };

  const reset = () => {
    setState({ isRunning: false, startedAt: null, accumulatedMs: 0 });
  };

  // ⏱️ rafraîchit l’affichage chaque seconde SANS toucher au storage
  useEffect(() => {
    if (!state.isRunning) return;
    intervalRef.current = setInterval(() => {
      force(t => t + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [state.isRunning]);

  return { elapsedMs, start, pause, reset, isRunning: state.isRunning };
}

// utils
export const formatMMSS = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);     // ✅ minutes non limitées (peuvent dépasser 59)
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;  // ex: 120:30
};

export const formatHMS = formatMMSS;
// renvoie HH:MM:SS