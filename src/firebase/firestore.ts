import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  onSnapshot, query, orderBy, Timestamp, writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { Tournament, Player, Match, TournamentFormData, PlayerFormData } from '../types';

// --- Tournaments ---
export const tournamentsCol = () => collection(db, 'tournaments');

export const createTournament = async (data: TournamentFormData, uid: string): Promise<string> => {
  const ref = await addDoc(tournamentsCol(), {
    ...data,
    startDate: Timestamp.fromDate(new Date(data.startDate)),
    endDate: Timestamp.fromDate(new Date(data.endDate)),
    registrationDeadline: Timestamp.fromDate(new Date(data.registrationDeadline)),
    createdBy: uid,
    createdAt: Timestamp.now(),
  });
  return ref.id;
};

export const updateTournament = (id: string, data: Partial<Tournament>) =>
  updateDoc(doc(db, 'tournaments', id), data as Record<string, unknown>);

export const subscribeTournaments = (cb: (t: Tournament[]) => void) =>
  onSnapshot(query(tournamentsCol(), orderBy('createdAt', 'desc')), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Tournament))
  );

export const subscribeTournament = (id: string, cb: (t: Tournament | null) => void) =>
  onSnapshot(doc(db, 'tournaments', id), snap =>
    cb(snap.exists() ? ({ id: snap.id, ...snap.data() }) as Tournament : null)
  );

// --- Players ---
export const playersCol = (tournamentId: string) =>
  collection(db, 'tournaments', tournamentId, 'players');

export const addPlayer = async (tournamentId: string, data: PlayerFormData): Promise<string> => {
  const ref = await addDoc(playersCol(tournamentId), {
    ...data,
    seed: null,
    registeredAt: Timestamp.now(),
    status: 'pending',
  });
  return ref.id;
};

export const updatePlayer = (tournamentId: string, playerId: string, data: Partial<Player>) =>
  updateDoc(doc(db, 'tournaments', tournamentId, 'players', playerId), data as Record<string, unknown>);

export const deletePlayer = (tournamentId: string, playerId: string) =>
  deleteDoc(doc(db, 'tournaments', tournamentId, 'players', playerId));

export const subscribePlayers = (tournamentId: string, cb: (p: Player[]) => void) =>
  onSnapshot(query(playersCol(tournamentId), orderBy('rankingPoints', 'desc')), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Player))
  );

export const importPlayers = async (tournamentId: string, players: PlayerFormData[]): Promise<void> => {
  const batch = writeBatch(db);
  for (const p of players) {
    const ref = doc(playersCol(tournamentId));
    batch.set(ref, { ...p, seed: null, registeredAt: Timestamp.now(), status: 'confirmed' });
  }
  await batch.commit();
};

// --- Matches ---
export const matchesCol = (tournamentId: string) =>
  collection(db, 'tournaments', tournamentId, 'matches');

export const saveMatches = async (tournamentId: string, matches: Match[]): Promise<void> => {
  const batch = writeBatch(db);
  // Delete existing
  const existing = await getDocs(matchesCol(tournamentId));
  existing.forEach(d => batch.delete(d.ref));
  // Add new
  for (const m of matches) {
    const ref = doc(matchesCol(tournamentId), m.id);
    batch.set(ref, m);
  }
  await batch.commit();
};

export const updateMatch = (tournamentId: string, matchId: string, data: Partial<Match>) =>
  updateDoc(doc(db, 'tournaments', tournamentId, 'matches', matchId), data as Record<string, unknown>);

export const updateMatchBatch = async (tournamentId: string, matches: Match[]): Promise<void> => {
  const batch = writeBatch(db);
  for (const m of matches) {
    batch.set(doc(matchesCol(tournamentId), m.id), m);
  }
  await batch.commit();
};

export const subscribeMatches = (tournamentId: string, cb: (m: Match[]) => void) =>
  onSnapshot(query(matchesCol(tournamentId), orderBy('round'), orderBy('matchNumber')), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Match))
  );
