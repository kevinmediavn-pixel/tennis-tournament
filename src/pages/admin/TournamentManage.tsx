import { useParams, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import { usePlayers } from '../../hooks/usePlayers';
import { useMatches } from '../../hooks/useMatches';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PlayerForm from '../../components/admin/PlayerForm';
import PlayerTable from '../../components/admin/PlayerTable';
import ExcelImport from '../../components/admin/ExcelImport';
import MatchScheduler from '../../components/admin/MatchScheduler';
import ResultEntry from '../../components/admin/ResultEntry';
import BracketView from '../../components/public/BracketView';
import { addPlayer, saveMatches, updateTournament } from '../../firebase/firestore';
import { generateBracket } from '../../utils/bracketGenerator';
import { useState } from 'react';
import { Shuffle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/shared/StatusBadge';

export default function TournamentManage() {
  const { id } = useParams<{ id: string }>();
  const tid = id!;
  const { tournament, loading } = useTournament(tid);
  const { players } = usePlayers(tid);
  const { matches } = useMatches(tid);
  const [generating, setGenerating] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (!tournament) return <div className="text-center py-16 text-gray-400">Không tìm thấy giải đấu</div>;

  const confirmedPlayers = players.filter(p => p.status === 'confirmed');

  const handleGenerateDraw = async () => {
    if (confirmedPlayers.length < 2) {
      alert('Cần ít nhất 2 VĐV đã xác nhận để tạo nhánh đấu.');
      return;
    }
    if (!confirm(`Tạo nhánh đấu cho ${confirmedPlayers.length} VĐV? Nhánh đấu hiện tại sẽ bị xóa.`)) return;
    setGenerating(true);
    try {
      const newMatches = generateBracket(confirmedPlayers);
      await saveMatches(tid, newMatches);
      await updateTournament(tid, { status: 'ongoing' });
    } catch {
      alert('Có lỗi xảy ra khi tạo nhánh đấu.');
    } finally {
      setGenerating(false);
    }
  };

  const tabs = [
    { to: 'players', label: 'VĐV' },
    { to: 'draw', label: 'Nhánh đấu' },
    { to: 'schedule', label: 'Lịch thi đấu' },
    { to: 'results', label: 'Kết quả' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-start gap-3 mb-6">
        <Link to="/admin/dashboard" className="mt-1 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 truncate">{tournament.name}</h1>
            <StatusBadge status={tournament.status} />
          </div>
          <p className="text-sm text-gray-500">{tournament.organizer} · {tournament.location}</p>
        </div>
        <button onClick={handleGenerateDraw} disabled={generating}
          className="flex items-center gap-1.5 text-sm px-3 py-2 bg-[#F9A825] text-white rounded-lg hover:bg-yellow-500 disabled:opacity-60 flex-shrink-0">
          <Shuffle className="w-4 h-4" />
          {generating ? 'Đang tạo...' : 'Tạo nhánh đấu'}
        </button>
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
        <Route index element={<Navigate to="players" replace />} />
        <Route path="players" element={
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Thêm VĐV thủ công</h2>
              <PlayerForm onSubmit={data => addPlayer(tid, data).then(() => {})} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Import từ Excel</h2>
              <ExcelImport tournamentId={tid} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Danh sách VĐV</h2>
              <PlayerTable players={players} tournamentId={tid} />
            </div>
          </div>
        } />
        <Route path="draw" element={
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Nhánh đấu</h2>
            <BracketView matches={matches} />
          </div>
        } />
        <Route path="schedule" element={
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Lịch thi đấu</h2>
            <MatchScheduler matches={matches} tournamentId={tid} />
          </div>
        } />
        <Route path="results" element={
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Nhập kết quả</h2>
            <ResultEntry matches={matches} players={players} tournamentId={tid} />
          </div>
        } />
      </Routes>
    </div>
  );
}
