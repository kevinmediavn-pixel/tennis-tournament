import { useParams, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import { usePlayers } from '../../hooks/usePlayers';
import { useMatches } from '../../hooks/useMatches';
import { useCourts } from '../../hooks/useCourts';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import BracketView from '../../components/public/BracketView';
import ScheduleView from '../../components/public/ScheduleView';
import CourtBoard from '../../components/public/CourtBoard';
import StatusBadge from '../../components/shared/StatusBadge';
import { MapPin, Calendar, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function TournamentPublic() {
  const { id } = useParams<{ id: string }>();
  const tid = id!;
  const { tournament, loading } = useTournament(tid);
  const { players } = usePlayers(tid);
  const { matches } = useMatches(tid);
  const { courts } = useCourts(tid);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return <div className="text-center py-16 text-gray-400">Không tìm thấy giải đấu</div>;

  const confirmedPlayers = players.filter(p => p.status === 'confirmed');

  const tabs = [
    { to: 'draw', label: 'Nhánh đấu' },
    { to: 'courts', label: `Sân đấu${courts.length ? ` (${courts.length})` : ''}` },
    { to: 'schedule', label: 'Lịch thi đấu' },
    { to: 'players', label: 'VĐV' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ArrowLeft className="w-4 h-4" /> Tất cả giải đấu
      </Link>

      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl text-white p-6 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <p className="text-green-200 mt-1">{tournament.organizer}</p>
          </div>
          <StatusBadge status={tournament.status} />
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-green-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />{tournament.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {tournament.startDate ? format(tournament.startDate.toDate(), 'dd/MM/yyyy', { locale: vi }) : '—'}
            {' – '}
            {tournament.endDate ? format(tournament.endDate.toDate(), 'dd/MM/yyyy', { locale: vi }) : '—'}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />{tournament.category} · {confirmedPlayers.length}/{tournament.maxPlayers} VĐV
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${isActive ? 'border-[#1B5E20] text-[#1B5E20]' : 'border-transparent text-gray-500 hover:text-gray-700'}`
            }>
            {t.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<Navigate to="draw" replace />} />
        <Route path="draw" element={<BracketView matches={matches} />} />
        <Route path="courts" element={<CourtBoard courts={courts} />} />
        <Route path="schedule" element={<ScheduleView matches={matches} />} />
        <Route path="players" element={
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Hạt giống</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Họ tên</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">CLB</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {confirmedPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      {p.seed ? <span className="bg-[#F9A825] text-white text-xs font-bold px-2 py-0.5 rounded">{p.seed}</span> : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.club || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{p.rankingPoints}</td>
                  </tr>
                ))}
                {confirmedPlayers.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Chưa có VĐV nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        } />
      </Routes>
    </div>
  );
}
