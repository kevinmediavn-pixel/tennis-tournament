import { Timestamp } from 'firebase/firestore';

export type TournamentFormat = 'single_elimination' | 'round_robin' | 'group_stage';
export type TournamentStatus = 'upcoming' | 'registration' | 'ongoing' | 'completed';
export type PlayerStatus = 'pending' | 'confirmed' | 'withdrawn';
export type MatchStatus = 'scheduled' | 'ongoing' | 'completed' | 'walkover';

export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  location: string;
  startDate: Timestamp;
  endDate: Timestamp;
  format: TournamentFormat;
  category: string;
  maxPlayers: number;
  registrationDeadline: Timestamp;
  status: TournamentStatus;
  createdBy: string;
  createdAt: Timestamp;
}

export interface Player {
  id: string;
  name: string;
  phone: string;
  email: string;
  club: string;
  rankingPoints: number;
  seed: number | null;
  registeredAt: Timestamp;
  status: PlayerStatus;
}

export interface Match {
  id: string;
  round: number;
  roundName: string;
  matchNumber: number;
  player1Id: string | null;
  player2Id: string | null;
  player1Name: string;
  player2Name: string;
  score: string;
  winnerId: string | null;
  court: string;
  scheduledTime: Timestamp | null;
  status: MatchStatus;
}

export interface TournamentFormData {
  name: string;
  organizer: string;
  location: string;
  startDate: string;
  endDate: string;
  format: TournamentFormat;
  category: string;
  maxPlayers: number;
  registrationDeadline: string;
  status: TournamentStatus;
}

export interface PlayerFormData {
  name: string;
  phone: string;
  email: string;
  club: string;
  rankingPoints: number;
}

export interface ExcelPlayerRow {
  stt?: number;
  name: string;
  club: string;
  phone: string;
  email: string;
  rankingPoints: number;
  error?: string;
}
