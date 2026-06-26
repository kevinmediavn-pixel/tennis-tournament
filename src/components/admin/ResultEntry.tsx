import { useState } from 'react';
import type { Match, Player } from '../../types';
import { updateMatchBatch } from '../../firebase/firestore';
import { advanceWinner } from '../../utils/bracketGenerator';
import StatusBadge from '../shared/StatusBadge';

interface Props {
  matches: Match[];
  players: Player[];
  tournamentId: string;
}

export default function ResultEntry({ matches, players, tournamentId }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [score, setScore] = useState('');
  const [winnerId, setWinnerId] = useState('');

  const getPlayer = (id: string | null) => players.find(p => p.id === id);

  const playableMatches = matches.filter(m =>
    m.status !== 'walkover' && (m.player1Id || m.player2Id)
  );

  const startEdit = (m: Match) => {
    setEditing(m.id);
    setScore(m.score || '');
    setWinnerId(m.winnerId || '');
  };

  const saveResult = async (m: Match) => {
    if (!winnerId) { alert('Vui lòng chọn người thắng.'); return; }
    const winnerName = getPlayer(winnerId)?.name ?? '';
    const updated = advanceWinner(matches, m, winnerId, winnerName);
    const changedMatch = updated.find(u => u.id === m.id)!;
    const finalMatch = { ...changedMatch, score, status: 'completed' as const };
    const allUpdated = updated.map(u => u.id === m.id ? finalMatch : u);
    await updateMatchBatch(tournamentId, allUpdated);
    setEditing(null);
  };

  const rounds = [...new Set(playableMatches.map(m => m.round))].sort();

  return (
    <div className="space-y-6">
      {rounds.map(round => {
        const roundMatches = playableMatches.filter(m => m.round === round);
        const roundName = roundMatches[0]?.roundName ?? `Vòng ${round}`;
        return (
          <div key={round}>
            <h3 className="font-semibold text-gray-800 mb-3">{roundName}</h3>
            <div className="space-y-2">
              {roundMatches.map(m => {
                const p1 = getPlayer(m.player1Id);
                const p2 = getPlayer(m.player2Id);
                return (
                  <div key={m.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${m.winnerId === m.player1Id && m.winnerId ? 'text-[#1B5E20] font-bold' : ''}`}>
                            {m.player1Name}
                          </span>
                          <span className="text-gray-300">vs</span>
                          <span className={`font-medium text-sm ${m.winnerId === m.player2Id && m.winnerId ? 'text-[#1B5E20] font-bold' : ''}`}>
                            {m.player2Name}
                          </span>
                        </div>
                        {m.score && <p className="text-sm font-mono text-gray-600">{m.score}</p>}
                        <div className="mt-1"><StatusBadge status={m.status} /></div>
                      </div>
                      {m.status !== 'completed' && (
                        <button onClick={() => startEdit(m)}
                          className="text-xs text-[#1B5E20] hover:underline flex-shrink-0">
                          Nhập kết quả
                        </button>
                      )}
                    </div>

                    {editing === m.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Tỉ số (vd: 6-3, 7-5)</label>
                          <input value={score} onChange={e => setScore(e.target.value)}
                            placeholder="6-3, 7-5" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Người thắng</label>
                          <div className="flex gap-2">
                            {m.player1Id && (
                              <button onClick={() => setWinnerId(m.player1Id!)}
                                className={`flex-1 text-sm py-2 rounded border transition-colors ${winnerId === m.player1Id ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'border-gray-300 hover:border-[#1B5E20]'}`}>
                                {p1?.name ?? m.player1Name}
                              </button>
                            )}
                            {m.player2Id && (
                              <button onClick={() => setWinnerId(m.player2Id!)}
                                className={`flex-1 text-sm py-2 rounded border transition-colors ${winnerId === m.player2Id ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'border-gray-300 hover:border-[#1B5E20]'}`}>
                                {p2?.name ?? m.player2Name}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 border rounded hover:bg-gray-50">Hủy</button>
                          <button onClick={() => saveResult(m)} className="text-xs px-3 py-1.5 bg-[#1B5E20] text-white rounded hover:bg-[#2E7D32]">Lưu kết quả</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {playableMatches.length === 0 && (
        <p className="text-center text-gray-400 py-8">Chưa có trận nào. Hãy tạo nhánh đấu trước.</p>
      )}
    </div>
  );
}
