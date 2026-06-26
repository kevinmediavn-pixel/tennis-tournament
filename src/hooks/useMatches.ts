import { useState, useEffect } from 'react';
import type { Match } from '../types';
import { subscribeMatches } from '../firebase/firestore';

export function useMatches(tournamentId: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    const unsub = subscribeMatches(tournamentId, m => { setMatches(m); setLoading(false); });
    return unsub;
  }, [tournamentId]);

  return { matches, loading };
}
