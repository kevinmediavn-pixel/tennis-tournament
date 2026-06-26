import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logoutAdmin } from '../../firebase/auth';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
  };

  return (
    <nav className="bg-[#1B5E20] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Trophy className="w-6 h-6 text-[#F9A825]" />
          <span>Tennis Tournament</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-1 text-sm hover:text-[#F9A825] transition-colors">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm hover:text-red-300 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="text-sm hover:text-[#F9A825] transition-colors">
              Đăng nhập Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
