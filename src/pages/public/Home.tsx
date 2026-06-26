import { Link } from 'react-router-dom';
import { useTournaments } from '../../hooks/useTournament';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Tournament } from '../../types';
import { useState } from 'react';

// Gradient palettes for tournament cards without real images
const CARD_GRADIENTS = [
  'from-emerald-900 via-green-800 to-emerald-950',
  'from-blue-900 via-blue-800 to-slate-900',
  'from-purple-900 via-violet-800 to-slate-900',
  'from-orange-900 via-amber-800 to-red-950',
  'from-cyan-900 via-teal-800 to-slate-900',
  'from-rose-900 via-pink-800 to-slate-900',
];

function getGradient(index: number) {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      Live
    </span>
  );
}

function SoonBadge() {
  return (
    <span className="inline-flex items-center bg-[#F9A825] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
      Sắp diễn ra
    </span>
  );
}

function TournamentBigCard({ t, index }: { t: Tournament; index: number }) {
  const start = t.startDate?.toDate();
  const end = t.endDate?.toDate();

  return (
    <Link to={`/tournament/${t.id}`} className="group block">
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${getGradient(index)} h-64 flex flex-col justify-between p-4`}>
        {/* Decorative tennis ball ring */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-[20px] border-white/5" />
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-[12px] border-white/5" />

        {/* Badge */}
        <div className="flex justify-between items-start relative z-10">
          {t.status === 'ongoing' ? <LiveBadge /> : <SoonBadge />}
        </div>

        {/* Tournament name */}
        <div className="relative z-10">
          <h3 className="font-black text-white text-xl leading-tight group-hover:text-[#00C851] transition-colors line-clamp-2">
            {t.name}
          </h3>
        </div>

        {/* Info row */}
        <div className="relative z-10 space-y-1 text-xs text-white/70">
          {start && end && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {format(start, 'dd/MM', { locale: vi })} – {format(end, 'dd/MM/yyyy', { locale: vi })}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{t.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {t.category} · {t.maxPlayers} VĐV
          </div>
        </div>

        {/* View button */}
        <div className="absolute bottom-4 right-4 z-10">
          <span className="text-xs text-[#00C851] font-semibold group-hover:underline">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}

function TournamentListRow({ t, index }: { t: Tournament; index: number }) {
  const start = t.startDate?.toDate();
  const end = t.endDate?.toDate();

  return (
    <Link to={`/tournament/${t.id}`}
      className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-[#131929] transition-colors group border border-transparent hover:border-[#1E2D45]">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex-shrink-0 bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-xl`}>
        🏆
      </div>

      {/* Name + location */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white group-hover:text-[#00C851] transition-colors truncate">{t.name}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
          {start && end && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(start, 'dd/MM')} – {format(end, 'dd/MM/yyyy')}
            </span>
          )}
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" />{t.location}
          </span>
        </div>
      </div>

      {/* Category + players */}
      <div className="hidden sm:flex flex-col items-end text-xs text-gray-500 flex-shrink-0">
        <span>{t.category}</span>
        <span>{t.maxPlayers} VĐV</span>
      </div>

      {/* Status */}
      <div className="flex-shrink-0">
        <SoonBadge />
      </div>

      {/* CTA */}
      <Link to={`/tournament/${t.id}`}
        className="flex-shrink-0 hidden sm:block border border-[#00C851] text-[#00C851] text-xs px-3 py-1.5 rounded-lg hover:bg-[#00C851] hover:text-black transition-colors font-medium">
        Xem chi tiết
      </Link>
    </Link>
  );
}

function FeaturedMatchPanel() {
  return (
    <div className="bg-[#131929] border border-[#1E2D45] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2D45]">
        <h3 className="font-bold text-white text-sm">TRẬN ĐẤU NỔI BẬT</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <LiveBadge />
          <span className="text-xs text-gray-400">Bán kết · Đơn nam</span>
        </div>

        {/* Players */}
        <div className="flex items-center gap-3">
          {/* Player 1 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 mx-auto mb-2 flex items-center justify-center text-lg font-black text-white">
              N
            </div>
            <p className="text-xs font-semibold text-white leading-tight">Nguyễn Văn Hùng</p>
            <p className="text-[10px] text-[#00C851]">Hạt giống 1</p>
          </div>

          {/* Score */}
          <div className="text-center flex-shrink-0">
            <div className="bg-[#0A0F1E] rounded-xl px-4 py-3 border border-[#1E2D45]">
              <p className="font-mono font-black text-white text-2xl">6 – 4</p>
              <p className="font-mono font-black text-white text-2xl">3 – 2</p>
              <p className="text-[10px] text-gray-500 mt-1">Set 2</p>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 mx-auto mb-2 flex items-center justify-center text-lg font-black text-white">
              T
            </div>
            <p className="text-xs font-semibold text-white leading-tight">Trần Minh Đức</p>
            <p className="text-[10px] text-gray-400">Hạt giống 3</p>
          </div>
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 bg-[#00C851]/10 hover:bg-[#00C851]/20 border border-[#00C851]/30 text-[#00C851] text-sm font-medium py-2.5 rounded-xl transition-colors">
          <Play className="w-4 h-4" />
          Xem trực tiếp
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          <span className="w-2 h-2 rounded-full bg-[#00C851]" />
          <span className="w-2 h-2 rounded-full bg-[#1E2D45]" />
          <span className="w-2 h-2 rounded-full bg-[#1E2D45]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { tournaments, loading } = useTournaments();
  const [cardPage, setCardPage] = useState(0);

  const active = tournaments.filter(t => t.status === 'ongoing' || t.status === 'registration');
  const others = tournaments.filter(t => t.status === 'upcoming' || t.status === 'completed');

  const CARDS_PER_PAGE = 4;
  const totalPages = Math.ceil(active.length / CARDS_PER_PAGE);
  const visibleCards = active.slice(cardPage * CARDS_PER_PAGE, (cardPage + 1) * CARDS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A0F1E] via-[#0D1829] to-[#0A1A0A]">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#00C851]/10 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#F9A825]/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left — Text */}
            <div className="flex-1">
              <p className="text-[#00C851] text-sm font-semibold uppercase tracking-widest mb-4">
                Nền tảng quản lý giải đấu chuyên nghiệp
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2">
                KẾT NỐI ĐAM MÊ
              </h1>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                NÂNG TẦM{' '}
                <span className="text-[#00C851]">TENNIS VIỆT</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-lg">
                Nền tảng quản lý và cập nhật giải đấu tennis chuyên nghiệp — theo dõi nhánh đấu, lịch thi đấu và kết quả trực tiếp.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#giai-dang-dien-ra"
                  className="flex items-center gap-2 bg-[#00C851] hover:bg-[#00a843] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Calendar className="w-4 h-4" />
                  Xem giải đấu đang diễn ra
                </a>
                <a href="#cac-giai-khac"
                  className="flex items-center gap-2 border border-[#1E2D45] hover:border-[#00C851] text-white px-6 py-3 rounded-xl transition-colors">
                  Khám phá thêm →
                </a>
              </div>
            </div>

            {/* Right — Tennis ball visual */}
            <div className="flex-shrink-0 relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00C851]/20 to-transparent blur-2xl" />
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
                {/* Glow */}
                <defs>
                  <radialGradient id="ballGlow" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#c8f040" />
                    <stop offset="60%" stopColor="#9fc800" />
                    <stop offset="100%" stopColor="#4a6000" />
                  </radialGradient>
                  <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00C851" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00C851" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Shadow blob */}
                <ellipse cx="200" cy="370" rx="130" ry="20" fill="#00C851" opacity="0.15" />
                {/* Ball */}
                <circle cx="200" cy="190" r="155" fill="url(#ballGlow)" />
                {/* Tennis seams */}
                <path d="M 90 140 Q 140 190 90 240" fill="none" stroke="white" strokeWidth="5" strokeOpacity="0.6" />
                <path d="M 310 140 Q 260 190 310 240" fill="none" stroke="white" strokeWidth="5" strokeOpacity="0.6" />
                {/* Shine */}
                <ellipse cx="155" cy="130" rx="45" ry="30" fill="white" opacity="0.15" transform="rotate(-30 155 130)" />
              </svg>

              {/* Floating stat cards */}
              <div className="absolute -left-4 top-8 bg-[#131929] border border-[#1E2D45] rounded-xl px-3 py-2 shadow-xl">
                <p className="text-[#00C851] font-black text-xl">{active.length || 0}</p>
                <p className="text-gray-400 text-xs">Giải đang diễn ra</p>
              </div>
              <div className="absolute -right-4 bottom-16 bg-[#131929] border border-[#1E2D45] rounded-xl px-3 py-2 shadow-xl">
                <p className="text-[#F9A825] font-black text-xl">{tournaments.length || 0}</p>
                <p className="text-gray-400 text-xs">Tổng giải đấu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* ── Đang diễn ra ── */}
            {loading ? <LoadingSpinner text="Đang tải giải đấu..." /> : (
              <>
                <section id="giai-dang-dien-ra">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00C851] animate-pulse" />
                      <h2 className="text-white font-black text-lg uppercase tracking-wide">
                        Giải đang diễn ra
                      </h2>
                    </div>
                    {active.length > CARDS_PER_PAGE && (
                      <div className="flex gap-1">
                        <button onClick={() => setCardPage(p => Math.max(0, p - 1))} disabled={cardPage === 0}
                          className="p-1.5 rounded-lg border border-[#1E2D45] text-gray-400 hover:text-white hover:border-[#00C851] disabled:opacity-30 transition-colors">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCardPage(p => Math.min(totalPages - 1, p + 1))} disabled={cardPage >= totalPages - 1}
                          className="p-1.5 rounded-lg border border-[#1E2D45] text-gray-400 hover:text-white hover:border-[#00C851] disabled:opacity-30 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {active.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {visibleCards.map((t, i) => (
                        <TournamentBigCard key={t.id} t={t} index={cardPage * CARDS_PER_PAGE + i} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-[#131929] rounded-xl border border-[#1E2D45]">
                      Hiện chưa có giải đang diễn ra
                    </div>
                  )}
                </section>

                {/* ── Các giải khác ── */}
                {others.length > 0 && (
                  <section id="cac-giai-khac">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F9A825]" />
                      <h2 className="text-white font-black text-lg uppercase tracking-wide">Các giải khác</h2>
                    </div>
                    <div className="bg-[#0D1520] border border-[#1E2D45] rounded-xl divide-y divide-[#1E2D45]">
                      {others.map((t, i) => <TournamentListRow key={t.id} t={t} index={i} />)}
                    </div>
                  </section>
                )}

                {tournaments.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    <div className="text-5xl mb-4">🎾</div>
                    <p>Chưa có giải đấu nào</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            <FeaturedMatchPanel />

            {/* Quick links */}
            <div className="bg-[#131929] border border-[#1E2D45] rounded-xl p-4">
              <h3 className="font-bold text-white text-sm mb-3">TRUY CẬP NHANH</h3>
              <div className="space-y-2">
                {[
                  { label: '🏆 Nhánh đấu', to: '/' },
                  { label: '📅 Lịch thi đấu', to: '/' },
                  { label: '🎾 Kết quả mới nhất', to: '/' },
                  { label: '🏅 Bảng xếp hạng', to: '/' },
                ].map(l => (
                  <Link key={l.label} to={l.to}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#0A0F1E] text-gray-400 hover:text-white transition-colors text-sm">
                    {l.label}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
