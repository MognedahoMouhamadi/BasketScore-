import { useRef, useCallback } from 'react';
import { finalizeMatch } from '../helpers/FinalizerMatch';

// Id unique simple
const newMatchId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Seuil de durée mini (3 s)
export const MIN_DURATION_MS = 3000;

export type Player = { name: string; score: number };

type UseMatchLogicArgs = {
  elapsedMs: number;
  teamAName: string;
  teamBName: string;
  playersA: Player[];
  playersB: Player[];
  /** appelé après sauvegarde réussie (ex: navigation) */
  onSaved?: (matchId: string) => void;
};

export function useMatchLogic({
  elapsedMs,
  teamAName,
  teamBName,
  playersA,
  playersB,
  onSaved,
}: UseMatchLogicArgs) {
  // Réfs : persistent sans rerender
  const matchIdRef = useRef<string>(newMatchId());
  const startedAtRef = useRef<number>(Date.now());

  /** À appeler quand on démarre un match depuis 0 */
  const handleStart = useCallback(() => {
    // Si on part d'un timer à 0, on ouvre un NOUVEAU match
    if (elapsedMs === 0) {
      matchIdRef.current = newMatchId();
      startedAtRef.current = Date.now();
    }
  }, [elapsedMs]);

  /** À appeler pour un restart (remise à zéro du timer côté composant) */
  const handleRestartSeed = useCallback(() => {
    matchIdRef.current = newMatchId();
    startedAtRef.current = Date.now();
  }, []);

  /** Finir le match, sauvegarder, puis prévenir le parent */
  const handleEnd = useCallback(async () => {
    if (elapsedMs <= MIN_DURATION_MS) return;

    const matchId = matchIdRef.current;
    const startedAt = startedAtRef.current;

    await finalizeMatch({
      matchId,
      teamAName,
      teamBName,
      playersA,
      playersB,
      durationMs: elapsedMs,
      startedAt,
      endedAt: Date.now(),
    });

    onSaved?.(matchId);
  }, [elapsedMs, teamAName, teamBName, playersA, playersB, onSaved]);

  return {
    matchIdRef, //est à utiliser pour l’export si besoin (ou affichage)
    startedAtRef,
    handleStart,        // à brancher sur onStart du chrono
    handleRestartSeed,  // à appeler AVANT reset() du chrono
    handleEnd,          // à brancher sur onEnd du chrono
  };
}
