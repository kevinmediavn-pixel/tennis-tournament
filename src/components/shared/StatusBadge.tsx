type Props = {
  status: string;
  type?: 'tournament' | 'player' | 'match';
};

const LABELS: Record<string, string> = {
  upcoming: 'Sắp diễn ra',
  registration: 'Đang đăng ký',
  ongoing: 'Đang thi đấu',
  completed: 'Đã kết thúc',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  withdrawn: 'Đã rút',
  scheduled: 'Chờ đấu',
  walkover: 'Đi bộ',
};

const COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  registration: 'bg-yellow-100 text-yellow-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  withdrawn: 'bg-red-100 text-red-600',
  scheduled: 'bg-blue-100 text-blue-700',
  walkover: 'bg-purple-100 text-purple-700',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
