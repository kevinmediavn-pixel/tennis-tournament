import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';
import type { Tournament } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function TournamentCard({ tournament }: { tournament: Tournament }) {
  const startDate = tournament.startDate?.toDate();
  const endDate = tournament.endDate?.toDate();

  return (
    <Link to={`/tournament/${tournament.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-[#1A1A1A] text-lg leading-tight">{tournament.name}</h3>
          <StatusBadge status={tournament.status} />
        </div>
        <p className="text-sm text-[#6B7280] mb-3">{tournament.organizer}</p>
        <div className="space-y-1.5 text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0 text-[#1B5E20]" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0 text-[#1B5E20]" />
            <span>
              {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : '—'}
              {' – '}
              {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0 text-[#1B5E20]" />
            <span>{tournament.category} · Tối đa {tournament.maxPlayers} VĐV</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
