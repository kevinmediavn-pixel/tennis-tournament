import { useState, useEffect } from 'react';
import type { Player } from '../types';
import { subscribePlayers } from '../firebase/firestore';

export function usePlayers(tournamentId: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    const unsub = subscribePlayers(tournamentId, p => { setPlayers(p); setLoading(false); });
    return unsub;
  }, [tournamentId]);

  return { players, loading };
}
