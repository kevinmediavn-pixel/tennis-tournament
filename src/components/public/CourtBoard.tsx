import type { Court, CourtStatus } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_CONFIG: Record<CourtStatus, { label: string; bg: string; badge: string; dot: string }> = {
  available:   { label: 'Sân trống',       bg: 'bg-white border-gray-200',           badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  in_play:     { label: 'Đang thi đấu',    bg: 'bg-red-50 border-red-200',           badge: 'bg-red-500 text-white',        dot: 'bg-red-500 animate-pulse' },
  maintenance: { label: 'Đang bảo trì',    bg: 'bg-yellow-50 border-yellow-200',     badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  closed:      { label: 'Đóng cửa',        bg: 'bg-gray-50 border-gray-200',         badge: 'bg-gray-200 text-gray-500',    dot: 'bg-gray-400' },
};

const SURFACE_LABELS: Record<string, string> = {
  hard: 'Sân cứng', clay: 'Sân đất nện', grass: 'Sân cỏ', indoor: 'Sân trong nhà',
};

export default function CourtBoard({ courts }: { courts: Court[] }) {
  if (courts.length === 0) {
    return <p className="text-center text-gray-400 py-10">Chưa có thông tin sân đấu</p>;
  }

  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">
          Cập nhật lúc {format(now, 'HH:mm', { locale: vi })} · Tự động làm mới
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" /> Đang đấu</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Trống</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Bảo trì</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courts.map(c => {
          const cfg = STATUS_CONFIG[c.status];
          return (
            <div key={c.id}
              className={`border-2 rounded-xl overflow-hidden shadow-sm transition-all ${cfg.bg}`}>
              {/* Court header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                  <p className="text-xs text-gray-400">{SURFACE_LABELS[c.surface] ?? c.surface}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-current ${c.status === 'in_play' ? 'animate-pulse' : ''}`} />
                  {cfg.label}
                </span>
              </div>

              {/* Match info */}
              <div className="px-4 pb-4 space-y-2">
                {c.status === 'in_play' && c.currentMatchLabel ? (
                  <div className="bg-white rounded-lg px-3 py-2.5 border border-red-100">
                    <p className="text-xs font-medium text-red-600 mb-1 uppercase tracking-wide">Đang thi đấu</p>
                    <p className="font-bold text-gray-900 text-sm leading-snug">{c.currentMatchLabel}</p>
                  </div>
                ) : c.status === 'available' && !c.currentMatchLabel ? (
                  <div className="bg-green-50 rounded-lg px-3 py-2.5 border border-green-100 text-center">
                    <p className="text-sm text-green-600 font-medium">Sân đang trống</p>
                  </div>
                ) : c.currentMatchLabel ? (
                  <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Trận hiện tại</p>
                    <p className="font-semibold text-gray-800 text-sm">{c.currentMatchLabel}</p>
                  </div>
                ) : null}

                {c.nextMatchLabel && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-100">
                    <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Tiếp theo</p>
                    <p className="text-sm text-gray-700">{c.nextMatchLabel}</p>
                  </div>
                )}

                {c.description && (
                  <p className="text-xs text-gray-400 pt-1">{c.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
