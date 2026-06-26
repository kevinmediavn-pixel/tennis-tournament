import { useState, useEffect } from 'react';
import type { Tournament } from '../types';
import { subscribeTournaments, subscribeTournament } from '../firebase/firestore';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeTournaments(t => { setTournaments(t); setLoading(false); });
    return unsub;
  }, []);

  return { tournaments, loading };
}

export function useTournament(id: string) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeTournament(id, t => { setTournament(t); setLoading(false); });
    return unsub;
  }, [id]);

  return { tournament, loading };
}
