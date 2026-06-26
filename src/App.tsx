import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/shared/Navbar';
import LoadingSpinner from './components/shared/LoadingSpinner';

import Home from './pages/public/Home';
import TournamentPublic from './pages/public/TournamentPublic';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import TournamentCreate from './pages/admin/TournamentCreate';
import TournamentManage from './pages/admin/TournamentManage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournament/:id/*" element={<TournamentPublic />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/admin/tournament/new" element={<RequireAuth><TournamentCreate /></RequireAuth>} />
            <Route path="/admin/tournament/:id/*" element={<RequireAuth><TournamentManage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
