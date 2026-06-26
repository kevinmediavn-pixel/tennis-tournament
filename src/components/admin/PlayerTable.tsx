import type { Player } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import { Trash2, CheckCircle, XCircle, Download } from 'lucide-react';
import { updatePlayer, deletePlayer } from '../../firebase/firestore';
import { exportPlayersToExcel } from '../../utils/excelParser';

interface Props {
  players: Player[];
  tournamentId: string;
}

export default function PlayerTable({ players, tournamentId }: Props) {
  const handleStatus = (p: Player, status: Player['status']) =>
    updatePlayer(tournamentId, p.id, { status });

  const handleDelete = (p: Player) => {
    if (confirm(`Xóa VĐV ${p.name}?`)) deletePlayer(tournamentId, p.id);
  };

  const handleExport = () => exportPlayersToExcel(players);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500">{players.length} vận động viên</p>
        <button onClick={handleExport}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-[#1B5E20] text-[#1B5E20] rounded-lg hover:bg-green-50">
          <Download className="w-4 h-4" />
          Xuất Excel
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Hạt giống</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Họ tên</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">CLB</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">SĐT</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Điểm</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-center">
                  {p.seed ? <span className="bg-[#F9A825] text-white text-xs font-bold px-2 py-0.5 rounded">{p.seed}</span> : '—'}
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.club || '—'}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.phone}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold">{p.rankingPoints}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {p.status !== 'confirmed' && (
                      <button onClick={() => handleStatus(p, 'confirmed')} title="Xác nhận"
                        className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {p.status !== 'withdrawn' && (
                      <button onClick={() => handleStatus(p, 'withdrawn')} title="Từ chối"
                        className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(p)} title="Xóa"
                      className="p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Chưa có VĐV nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
