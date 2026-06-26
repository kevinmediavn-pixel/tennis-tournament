import { useTournaments } from '../../hooks/useTournament';
import TournamentCard from '../../components/public/TournamentCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Trophy } from 'lucide-react';

export default function Home() {
  const { tournaments, loading } = useTournaments();

  const ongoing = tournaments.filter(t => t.status === 'ongoing' || t.status === 'registration');
  const others = tournaments.filter(t => t.status === 'upcoming' || t.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1B5E20] rounded-full mb-4">
          <Trophy className="w-8 h-8 text-[#F9A825]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tennis Tournament</h1>
        <p className="text-gray-500 mt-2">Hệ thống quản lý giải đấu tennis</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-8">
          {ongoing.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                Giải đang diễn ra
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ongoing.map(t => <TournamentCard key={t.id} tournament={t} />)}
              </div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Các giải khác</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {others.map(t => <TournamentCard key={t.id} tournament={t} />)}
              </div>
            </div>
          )}
          {tournaments.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Chưa có giải đấu nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
