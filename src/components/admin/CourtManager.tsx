import { useState } from 'react';
import type { Court, CourtFormData, CourtStatus, Match } from '../../types';
import { addCourt, updateCourt, deleteCourt } from '../../firebase/firestore';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

interface Props {
  courts: Court[];
  matches: Match[];
  tournamentId: string;
}

const SURFACE_LABELS: Record<string, string> = {
  hard: 'Sân cứng',
  clay: 'Sân đất nện',
  grass: 'Sân cỏ',
  indoor: 'Sân trong nhà',
};

const STATUS_CONFIG: Record<CourtStatus, { label: string; color: string; dot: string }> = {
  available:   { label: 'Trống',          color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  in_play:     { label: 'Đang thi đấu',   color: 'bg-red-100 text-red-700',     dot: 'bg-red-500 animate-pulse' },
  maintenance: { label: 'Bảo trì',        color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  closed:      { label: 'Đóng cửa',       color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400' },
};

const EMPTY_FORM: CourtFormData = { name: '', surface: 'hard', description: '' };

export default function CourtManager({ courts, matches, tournamentId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CourtFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState<{
    status: CourtStatus;
    currentMatchId: string;
    currentMatchLabel: string;
    nextMatchId: string;
    nextMatchLabel: string;
  }>({ status: 'available', currentMatchId: '', currentMatchLabel: '', nextMatchId: '', nextMatchLabel: '' });

  // Only show non-completed, non-walkover matches for assignment
  const assignableMatches = matches.filter(
    m => m.status !== 'completed' && m.status !== 'walkover' && m.player1Name !== 'TBD' && m.player2Name !== 'TBD'
  );

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await addCourt(tournamentId, form);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Court) => {
    if (!confirm(`Xóa sân "${c.name}"?`)) return;
    await deleteCourt(tournamentId, c.id);
  };

  const openStatusEdit = (c: Court) => {
    setEditingStatus(c.id);
    setStatusForm({
      status: c.status,
      currentMatchId: c.currentMatchId ?? '',
      currentMatchLabel: c.currentMatchLabel ?? '',
      nextMatchId: c.nextMatchId ?? '',
      nextMatchLabel: c.nextMatchLabel ?? '',
    });
  };

  const handleMatchSelect = (field: 'current' | 'next', matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    const label = match ? `${match.player1Name} vs ${match.player2Name} (${match.roundName})` : '';
    if (field === 'current') {
      setStatusForm(f => ({
        ...f,
        currentMatchId: matchId,
        currentMatchLabel: label,
        status: matchId ? 'in_play' : f.status,
      }));
    } else {
      setStatusForm(f => ({ ...f, nextMatchId: matchId, nextMatchLabel: label }));
    }
  };

  const saveStatus = async (courtId: string) => {
    await updateCourt(tournamentId, courtId, {
      status: statusForm.status,
      currentMatchId: statusForm.currentMatchId || null,
      currentMatchLabel: statusForm.currentMatchLabel,
      nextMatchId: statusForm.nextMatchId || null,
      nextMatchLabel: statusForm.nextMatchLabel,
    });
    setEditingStatus(null);
  };

  return (
    <div className="space-y-5">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{courts.length} sân đấu</p>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 text-sm px-3 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32]">
          <Plus className="w-4 h-4" />
          Thêm sân
        </button>
      </div>

      {/* Add Court Form */}
      {showForm && (
        <form onSubmit={handleAddCourt}
          className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Thêm sân mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên sân *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Sân 1 / Court A"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mặt sân</label>
              <select value={form.surface} onChange={e => setForm(f => ({ ...f, surface: e.target.value as CourtFormData['surface'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
                {Object.entries(SURFACE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả / Vị trí</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Khu A, tầng 1..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] disabled:opacity-60">
              {saving ? 'Đang lưu...' : 'Thêm sân'}
            </button>
          </div>
        </form>
      )}

      {/* Court Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map(c => {
          const cfg = STATUS_CONFIG[c.status];
          const isEditing = editingStatus === c.id;
          return (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <span className="text-xs text-gray-400">{SURFACE_LABELS[c.surface]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => isEditing ? setEditingStatus(null) : openStatusEdit(c)}
                    className="p-1.5 text-[#1B5E20] hover:bg-green-50 rounded-lg" title="Cập nhật trạng thái">
                    {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(c)}
                    className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg" title="Xóa sân">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Badge + Info */}
              {!isEditing && (
                <div className="px-4 py-3 space-y-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  {c.description && <p className="text-xs text-gray-400">{c.description}</p>}
                  {c.currentMatchLabel && (
                    <div className="bg-red-50 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium text-red-700 mb-0.5">Đang thi đấu</p>
                      <p className="text-sm font-semibold text-gray-800">{c.currentMatchLabel}</p>
                    </div>
                  )}
                  {c.nextMatchLabel && (
                    <div className="bg-blue-50 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium text-blue-700 mb-0.5">Trận tiếp theo</p>
                      <p className="text-sm text-gray-700">{c.nextMatchLabel}</p>
                    </div>
                  )}
                  {!c.currentMatchLabel && !c.nextMatchLabel && c.status === 'available' && (
                    <p className="text-xs text-gray-400 italic">Sân đang trống</p>
                  )}
                </div>
              )}

              {/* Edit Status Panel */}
              {isEditing && (
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái sân</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(STATUS_CONFIG) as CourtStatus[]).map(s => (
                        <button key={s} onClick={() => setStatusForm(f => ({ ...f, status: s }))}
                          className={`text-xs py-2 px-3 rounded-lg border transition-colors text-left flex items-center gap-2 ${
                            statusForm.status === s ? 'border-[#1B5E20] bg-green-50 text-[#1B5E20] font-medium' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot.replace('animate-pulse', '')}`} />
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trận đang diễn ra</label>
                    <select value={statusForm.currentMatchId}
                      onChange={e => handleMatchSelect('current', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
                      <option value="">-- Không có --</option>
                      {assignableMatches.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.player1Name} vs {m.player2Name} ({m.roundName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trận tiếp theo</label>
                    <select value={statusForm.nextMatchId}
                      onChange={e => handleMatchSelect('next', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
                      <option value="">-- Không có --</option>
                      {assignableMatches.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.player1Name} vs {m.player2Name} ({m.roundName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button onClick={() => setEditingStatus(null)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                    <button onClick={() => saveStatus(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32]">
                      <Check className="w-4 h-4" /> Lưu
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {courts.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <p className="mb-2">Chưa có sân nào. Thêm sân đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
}
