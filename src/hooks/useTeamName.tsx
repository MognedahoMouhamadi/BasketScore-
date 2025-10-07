import { useState } from 'react';
import { usePersistentState } from './useStorage';

/**
 * Gère les noms des équipes avec persistance et modal de renommage.
 */
export function useTeamNames() {
  // 🔹 Noms persistés localement
  const [teamAName, setTeamAName] = usePersistentState<string>('teamA_name', 'Team A');
  const [teamBName, setTeamBName] = usePersistentState<string>('teamB_name', 'Team B');

  // 🔹 État de la modale
  const [renameOpen, setRenameOpen] = useState<{ open: boolean; team: 'A' | 'B' | null }>({
    open: false,
    team: null,
  });

  // --- Actions ---

  /** Ouvre la modale pour renommer une équipe */
  const openRename = (team: 'A' | 'B') => setRenameOpen({ open: true, team });

  /** Ferme la modale */
  const closeRename = () => setRenameOpen({ open: false, team: null });

  /** Sauvegarde le nouveau nom et ferme la modale */
  const saveRename = (newName: string) => {
    const name = newName.trim();
    if (!name) return;
    if (renameOpen.team === 'A') setTeamAName(name);
    if (renameOpen.team === 'B') setTeamBName(name);
    closeRename();
  };

  return {
    teamAName,
    teamBName,
    renameOpen,   // { open, team }
    openRename,   // (team: 'A' | 'B') => void
    closeRename,  // () => void
    saveRename,   // (newName: string) => void
  };
}
