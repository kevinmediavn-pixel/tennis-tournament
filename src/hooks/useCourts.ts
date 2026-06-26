import { useState, useEffect } from 'react';
import type { Court } from '../types';
import { subscribeCourts } from '../firebase/firestore';

export function useCourts(tournamentId: string) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    const unsub = subscribeCourts(tournamentId, c => { setCourts(c); setLoading(false); });
    return unsub;
  }, [tournamentId]);

  return { courts, loading };
}
