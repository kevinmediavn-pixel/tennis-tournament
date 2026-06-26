import type { Match } from '../../types';

interface Props {
  matches: Match[];
}

export default function BracketView({ matches }: Props) {
  const rounds = [...new Set(matches.map(m => m.round))].sort();

  if (matches.length === 0) {
    return <p className="text-center text-gray-400 py-10">Chưa có nhánh đấu</p>;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-0 min-w-max">
        {rounds.map((round, roundIdx) => {
          const roundMatches = matches.filter(m => m.round === round).sort((a, b) => a.matchNumber - b.matchNumber);
          const roundName = roundMatches[0]?.roundName ?? `Vòng ${round}`;
          const totalRounds = rounds.length;
          // Each round doubles the height spacing
          const spacingMultiplier = Math.pow(2, roundIdx);

          return (
            <div key={round} className="flex flex-col" style={{ minWidth: '200px' }}>
              <div className="text-center text-xs font-semibold text-[#1B5E20] py-2 px-3 bg-green-50 border-b border-green-200 mb-2">
                {roundName}
              </div>
              <div className="flex flex-col justify-around flex-1 px-2"
                style={{ gap: `${spacingMultiplier * 8}px`, paddingTop: `${(spacingMultiplier - 1) * 32}px` }}>
                {roundMatches.map(m => (
                  <MatchCard key={m.id} match={m} isLastRound={roundIdx === totalRounds - 1} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatchCard({ match, isLastRound }: { match: Match; isLastRound: boolean }) {
  const isWinner1 = match.winnerId === match.player1Id && match.winnerId;
  const isWinner2 = match.winnerId === match.player2Id && match.winnerId;

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${isLastRound ? 'border-[#F9A825] border-2' : 'border-gray-200'}`}
      style={{ minWidth: '180px' }}>
      <PlayerRow name={match.player1Name} isWinner={!!isWinner1} score={match.score ? match.score.split(',')[0] : ''} />
      <div className="h-px bg-gray-200" />
      <PlayerRow name={match.player2Name} isWinner={!!isWinner2} score={match.score ? (match.score.split(',')[1] ?? '') : ''} />
      {match.status === 'completed' && match.score && (
        <div className="bg-gray-50 px-2 py-1 text-xs text-center text-gray-500 font-mono">{match.score}</div>
      )}
    </div>
  );
}

function PlayerRow({ name, isWinner, score }: { name: string; isWinner: boolean; score: string }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${isWinner ? 'bg-green-50' : 'bg-white'}`}>
      <span className={`text-xs truncate max-w-[120px] ${isWinner ? 'font-bold text-[#1B5E20]' : name === 'TBD' ? 'text-gray-300 italic' : 'text-gray-700'}`}>
        {name || 'TBD'}
      </span>
      {score && <span className="text-xs font-mono text-gray-500 ml-1">{score.trim()}</span>}
    </div>
  );
}
