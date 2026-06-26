import { useState } from 'react';
import type { Match } from '../../types';
import { updateMatch } from '../../firebase/firestore';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { Calendar, MapPin } from 'lucide-react';

interface Props {
  matches: Match[];
  tournamentId: string;
}

export default function MatchScheduler({ matches, tournamentId }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [court, setCourt] = useState('');
  const [time, setTime] = useState('');

  const startEdit = (m: Match) => {
    setEditing(m.id);
    setCourt(m.court || '');
    setTime(m.scheduledTime ? format(m.scheduledTime.toDate(), "yyyy-MM-dd'T'HH:mm") : '');
  };

  const saveEdit = async (m: Match) => {
    await updateMatch(tournamentId, m.id, {
      court,
      scheduledTime: time ? Timestamp.fromDate(new Date(time)) : null,
    });
    setEditing(null);
  };

  const rounds = [...new Set(matches.map(m => m.round))].sort();

  return (
    <div className="space-y-6">
      {rounds.map(round => {
        const roundMatches = matches.filter(m => m.round === round);
        const roundName = roundMatches[0]?.roundName ?? `Vòng ${round}`;
        return (
          <div key={round}>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B5E20] inline-block" />
              {roundName}
            </h3>
            <div className="space-y-2">
              {roundMatches.map(m => (
                <div key={m.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">
                        {m.player1Name} <span className="text-gray-400 mx-1">vs</span> {m.player2Name}
                      </p>
                      {m.court && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />{m.court}
                        </p>
                      )}
                      {m.scheduledTime && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {format(m.scheduledTime.toDate(), 'HH:mm dd/MM/yyyy')}
                        </p>
                      )}
                    </div>
                    <button onClick={() => startEdit(m)}
                      className="text-xs text-[#1B5E20] hover:underline flex-shrink-0">
                      Cài đặt
                    </button>
                  </div>
                  {editing === m.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Sân</label>
                          <input value={court} onChange={e => setCourt(e.target.value)}
                            placeholder="Sân 1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Giờ thi đấu</label>
                          <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 border rounded hover:bg-gray-50">Hủy</button>
                        <button onClick={() => saveEdit(m)} className="text-xs px-3 py-1.5 bg-[#1B5E20] text-white rounded hover:bg-[#2E7D32]">Lưu</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
