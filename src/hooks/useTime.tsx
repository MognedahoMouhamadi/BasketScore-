// hooks/useTime.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePersistentState } from './useStorage';

type TimerState = { isRunning: boolean; startedAt: number | null; accumulatedMs: number; };

export function useGameTimer(storageKey = 'game_timer') {
  const [state, setState] = usePersistentState<TimerState>(storageKey, {
    isRunning: false, startedAt: null, accumulatedMs: 0,
  });

  // tick local pour re-render sans écrire dans le storage
  const [, force] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsedMs = useMemo(() => {
    if (!state.isRunning || state.startedAt == null) return state.accumulatedMs;
    return state.accumulatedMs + (Date.now() - state.startedAt);
  }, [state]);

  const start = () => {
    if (state.isRunning) return;
    setState({ ...state, isRunning: true, startedAt: Date.now() });
  };

  const pause = () => {
    if (!state.isRunning || state.startedAt == null) return;
    const now = Date.now();
    setState({ isRunning: false, startedAt: null, accumulatedMs: state.accumulatedMs + (now - state.startedAt) });
  };

  const reset = () => setState({ isRunning: false, startedAt: null, accumulatedMs: 0 });

  useEffect(() => {
    if (!state.isRunning) return;
    intervalRef.current = setInterval(() => { force(x => x + 1); }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };
  }, [state.isRunning]);

  return { elapsedMs, start, pause, reset, isRunning: state.isRunning };
}

export const formatMMSS = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};
// compat si du code appelle encore formatHMS
export const formatHMS = formatMMSS;
