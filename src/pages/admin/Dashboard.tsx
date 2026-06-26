import { Link } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';
import { useTournaments } from '../../hooks/useTournament';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import StatusBadge from '../../components/shared/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Dashboard() {
  const { tournaments, loading } = useTournaments();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý giải đấu</h1>
          <p className="text-gray-500 text-sm mt-1">{tournaments.length} giải đấu</p>
        </div>
        <Link to="/admin/tournament/new"
          className="flex items-center gap-2 bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Tạo giải mới
        </Link>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {tournaments.map(t => (
            <Link key={t.id} to={`/admin/tournament/${t.id}/players`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-[#1B5E20]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.organizer} · {t.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t.startDate ? format(t.startDate.toDate(), 'dd/MM/yyyy', { locale: vi }) : '—'}
                      {' – '}
                      {t.endDate ? format(t.endDate.toDate(), 'dd/MM/yyyy', { locale: vi }) : '—'}
                    </p>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>
            </Link>
          ))}
          {tournaments.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Chưa có giải đấu nào. Hãy tạo giải mới!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
