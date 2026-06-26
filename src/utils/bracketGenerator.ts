import type { Player, Match } from '../types';
import { getRoundName, getTotalRounds } from './roundNames';
import { Timestamp } from 'firebase/firestore';

export type BracketSize = 8 | 16 | 32 | 64;

// Standard ITF seeding positions for bracket sizes
const SEED_POSITIONS: Record<BracketSize, number[][]> = {
  8:  [[0], [7], [3, 4], [2, 5], [1, 6]],
  16: [[0], [15], [7, 8], [3, 4, 11, 12], [1, 2, 5, 6, 9, 10, 13, 14]],
  32: [[0], [31], [15, 16], [7, 8, 23, 24], [3, 4, 11, 12, 19, 20, 27, 28], []],
  64: [[0], [63], [31, 32], [15, 16, 47, 48], [7, 8, 23, 24, 39, 40, 55, 56], []],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BYE_PLAYER: Player = {
  id: 'bye',
  name: 'Bye',
  phone: '',
  email: '',
  club: '',
  rankingPoints: -1,
  seed: null,
  registeredAt: Timestamp.now(),
  status: 'confirmed',
};

export function getNextBracketSize(playerCount: number): BracketSize {
  const sizes: BracketSize[] = [8, 16, 32, 64];
  return sizes.find(s => s >= playerCount) ?? 64;
}

export function generateBracket(players: Player[]): Match[] {
  const sorted = [...players].sort((a, b) => b.rankingPoints - a.rankingPoints);
  const bracketSize = getNextBracketSize(sorted.length);
  const totalRounds = getTotalRounds(bracketSize);

  // Pad with BYEs
  while (sorted.length < bracketSize) {
    sorted.push({ ...BYE_PLAYER, id: `bye-${sorted.length}` });
  }

  // Create bracket slots array (bracketSize slots)
  const slots: (Player | null)[] = new Array(bracketSize).fill(null);

  const seedPositions = SEED_POSITIONS[bracketSize];
  let playerIdx = 0;

  // Place seeds into fixed/random positions by group
  for (let seedGroup = 0; seedGroup < seedPositions.length; seedGroup++) {
    const positions = seedPositions[seedGroup];
    if (positions.length === 0) continue;
    const shuffledPositions = shuffle(positions);
    for (const pos of shuffledPositions) {
      if (playerIdx < sorted.length && sorted[playerIdx].id !== 'bye') {
        sorted[playerIdx] = { ...sorted[playerIdx], seed: playerIdx + 1 };
      }
      slots[pos] = sorted[playerIdx] ?? null;
      playerIdx++;
    }
  }

  // Fill remaining slots with shuffled non-seeded players
  const remaining = sorted.slice(playerIdx);
  const emptySlots: number[] = [];
  slots.forEach((s, i) => { if (s === null) emptySlots.push(i); });
  const shuffledRemaining = shuffle(remaining);
  emptySlots.forEach((pos, i) => {
    slots[pos] = shuffledRemaining[i] ?? { ...BYE_PLAYER, id: `bye-extra-${i}` };
  });

  const matches: Match[] = [];

  // Round 1 matches
  for (let i = 0; i < bracketSize; i += 2) {
    const p1 = slots[i];
    const p2 = slots[i + 1];
    const matchNum = i / 2 + 1;
    const isBye1 = p1?.id.startsWith('bye');
    const isBye2 = p2?.id.startsWith('bye');

    const match: Match = {
      id: `r1-m${matchNum}`,
      round: 1,
      roundName: getRoundName(1, totalRounds),
      matchNumber: matchNum,
      player1Id: p1 && !isBye1 ? p1.id : null,
      player2Id: p2 && !isBye2 ? p2.id : null,
      player1Name: p1 ? p1.name : 'TBD',
      player2Name: p2 ? p2.name : 'TBD',
      score: '',
      winnerId: isBye2 && !isBye1 ? (p1?.id ?? null) : isBye1 && !isBye2 ? (p2?.id ?? null) : null,
      court: '',
      scheduledTime: null,
      status: isBye1 || isBye2 ? 'walkover' : 'scheduled',
    };
    matches.push(match);
  }

  // Empty matches for subsequent rounds
  for (let round = 2; round <= totalRounds; round++) {
    const matchesInRound = bracketSize / Math.pow(2, round);
    for (let m = 1; m <= matchesInRound; m++) {
      matches.push({
        id: `r${round}-m${m}`,
        round,
        roundName: getRoundName(round, totalRounds),
        matchNumber: m,
        player1Id: null,
        player2Id: null,
        player1Name: 'TBD',
        player2Name: 'TBD',
        score: '',
        winnerId: null,
        court: '',
        scheduledTime: null,
        status: 'scheduled',
      });
    }
  }

  return matches;
}

export function advanceWinner(
  matches: Match[],
  completedMatch: Match,
  winnerId: string,
  winnerName: string
): Match[] {
  const updated = matches.map(m => m.id === completedMatch.id ? { ...m, winnerId, status: 'completed' as const } : m);

  // Find next round match
  const nextRound = completedMatch.round + 1;
  const nextMatchNum = Math.ceil(completedMatch.matchNumber / 2);
  const isPlayer1Slot = completedMatch.matchNumber % 2 !== 0;

  return updated.map(m => {
    if (m.round === nextRound && m.matchNumber === nextMatchNum) {
      if (isPlayer1Slot) {
        return { ...m, player1Id: winnerId, player1Name: winnerName };
      } else {
        return { ...m, player2Id: winnerId, player2Name: winnerName };
      }
    }
    return m;
  });
}
