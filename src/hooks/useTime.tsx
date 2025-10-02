// hooks/useGameTimer.ts
import { useEffect, useRef, useMemo } from 'react';
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

  const raf = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // tick “visuel” si tu veux rafraîchir un affichage chaque seconde
  useEffect(() => {
    if (!state.isRunning) return;
    raf.current = setInterval(() => {
      // juste pour déclencher un re-render via setState noop
      setState(s => ({ ...s }));
    }, 1000);
    return () => {
      if (raf.current) clearInterval(raf.current);
    };
  }, [state.isRunning, setState]);

  return { elapsedMs, start, pause, reset, isRunning: state.isRunning };
}

// util
export const formatHMS = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
};
