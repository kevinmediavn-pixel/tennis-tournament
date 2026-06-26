import type { Match } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import StatusBadge from '../shared/StatusBadge';
import { MapPin, Clock } from 'lucide-react';

export default function ScheduleView({ matches }: { matches: Match[] }) {
  const scheduled = matches.filter(m => m.scheduledTime && m.status !== 'walkover');

  const byDate: Record<string, Match[]> = {};
  for (const m of scheduled) {
    const key = format(m.scheduledTime!.toDate(), 'yyyy-MM-dd');
    byDate[key] = [...(byDate[key] ?? []), m];
  }
  const dates = Object.keys(byDate).sort();

  if (dates.length === 0) {
    return <p className="text-center text-gray-400 py-10">Chưa có lịch thi đấu</p>;
  }

  return (
    <div className="space-y-6">
      {dates.map(date => (
        <div key={date}>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-[#1B5E20] text-white text-xs px-2 py-1 rounded">
              {format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi })}
            </span>
          </h3>
          <div className="space-y-2">
            {byDate[date].sort((a, b) =>
              (a.scheduledTime?.toMillis() ?? 0) - (b.scheduledTime?.toMillis() ?? 0)
            ).map(m => (
              <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <div className="text-center w-14 flex-shrink-0">
                  <p className="text-lg font-bold text-[#1B5E20]">
                    {format(m.scheduledTime!.toDate(), 'HH:mm')}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{m.player1Name} <span className="text-gray-400">vs</span> {m.player2Name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{m.roundName}
                    </span>
                    {m.court && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{m.court}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={m.status} />
                  {m.score && <p className="text-xs font-mono text-gray-500 mt-1 text-right">{m.score}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
