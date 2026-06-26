import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logoutAdmin } from '../../firebase/auth';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', exact: true },
  { to: '/giai-dau', label: 'Giải đấu' },
  { to: '/nhanh-dau', label: 'Nhánh đấu' },
  { to: '/lich-thi-dau', label: 'Lịch thi đấu' },
  { to: '/vdv', label: 'VĐV' },
  { to: '/ket-qua', label: 'Kết quả' },
  { to: '/tin-tuc', label: 'Tin tức' },
];

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => { await logoutAdmin(); navigate('/'); };

  return (
    <nav className="bg-[#0D1520] border-b border-[#1E2D45] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#00C851] rounded-full flex items-center justify-center">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="font-black text-white text-lg">
              Tennis<span className="text-[#00C851]">Viet</span>
              <span className="text-[#F9A825] text-xs font-bold">.net</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-[#00C851]' : 'text-gray-400 hover:text-white'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(v => !v)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
              <Search className="w-4 h-4" />
            </button>
            {user ? (
              <>
                <Link to="/admin/dashboard"
                  className="hidden sm:block text-sm text-[#00C851] hover:text-white border border-[#00C851] px-3 py-1.5 rounded-lg transition-colors">
                  Admin
                </Link>
                <button onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link to="/admin/login"
                className="text-sm font-semibold bg-[#00C851] hover:bg-[#00a843] text-white px-4 py-2 rounded-lg transition-colors">
                Đăng nhập
              </Link>
            )}
            <button onClick={() => setMenuOpen(v => !v)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <input autoFocus placeholder="Tìm kiếm giải đấu..."
              className="w-full bg-[#131929] border border-[#1E2D45] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C851]" />
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-lg ${isActive ? 'text-[#00C851] bg-[#00C851]/10' : 'text-gray-400 hover:text-white'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
