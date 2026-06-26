import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import type { TournamentFormData } from '../../types';
import { ArrowLeft } from 'lucide-react';

const TODAY = new Date().toISOString().split('T')[0];

const EMPTY: TournamentFormData = {
  name: '',
  organizer: '',
  location: '',
  startDate: TODAY,
  endDate: TODAY,
  format: 'single_elimination',
  category: 'Nam đơn',
  maxPlayers: 16,
  registrationDeadline: TODAY,
  status: 'registration',
};

export default function TournamentCreate() {
  const [form, setForm] = useState<TournamentFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const set = (field: keyof TournamentFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: field === 'maxPlayers' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const id = await createTournament(form, user.uid);
      navigate(`/admin/tournament/${id}/players`);
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo giải đấu mới</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên giải đấu *</label>
          <input value={form.name} onChange={set('name')} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            placeholder="Giải Tennis Mở Rộng 2025" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tổ chức</label>
            <input value={form.organizer} onChange={set('organizer')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
            <input value={form.location} onChange={set('location')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
            <input type="date" value={form.startDate} onChange={set('startDate')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
            <input type="date" value={form.endDate} onChange={set('endDate')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hạn đăng ký</label>
          <input type="date" value={form.registrationDeadline} onChange={set('registrationDeadline')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung thi đấu</label>
            <select value={form.category} onChange={set('category')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
              <option>Nam đơn</option>
              <option>Nữ đơn</option>
              <option>Nam đôi</option>
              <option>Nữ đôi</option>
              <option>Đôi nam nữ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thể thức</label>
            <select value={form.format} onChange={set('format')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
              <option value="single_elimination">Loại trực tiếp</option>
              <option value="round_robin">Vòng tròn</option>
              <option value="group_stage">Vòng bảng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số VĐV tối đa</label>
            <select value={form.maxPlayers} onChange={set('maxPlayers')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
              <option value={64}>64</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select value={form.status} onChange={set('status')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]">
            <option value="upcoming">Sắp diễn ra</option>
            <option value="registration">Đang đăng ký</option>
            <option value="ongoing">Đang thi đấu</option>
            <option value="completed">Đã kết thúc</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Hủy
          </button>
          <button type="submit" disabled={loading}
            className="px-5 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] disabled:opacity-60">
            {loading ? 'Đang tạo...' : 'Tạo giải đấu'}
          </button>
        </div>
      </form>
    </div>
  );
}
