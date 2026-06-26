import { useState } from 'react';
import type { PlayerFormData } from '../../types';

interface Props {
  onSubmit: (data: PlayerFormData) => Promise<void>;
  onCancel?: () => void;
}

const EMPTY: PlayerFormData = { name: '', phone: '', email: '', club: '', rankingPoints: 0 };

export default function PlayerForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<PlayerFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof PlayerFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: field === 'rankingPoints' ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError('Vui lòng nhập họ tên và số điện thoại.'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
      setForm(EMPTY);
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm bg-red-50 rounded p-2">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
          <input value={form.name} onChange={set('name')} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
          <input value={form.phone} onChange={set('phone')} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            placeholder="09xxxxxxxx" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={form.email} onChange={set('email')} type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Câu lạc bộ</label>
          <input value={form.club} onChange={set('club')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            placeholder="CLB Tennis ABC" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Điểm xếp hạng</label>
          <input value={form.rankingPoints} onChange={set('rankingPoints')} type="number" min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Hủy
          </button>
        )}
        <button type="submit" disabled={loading}
          className="px-4 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] disabled:opacity-50">
          {loading ? 'Đang lưu...' : 'Thêm VĐV'}
        </button>
      </div>
    </form>
  );
}
