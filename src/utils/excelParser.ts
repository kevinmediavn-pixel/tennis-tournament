import * as XLSX from 'xlsx';
import type { ExcelPlayerRow } from '../types';

export function parseExcelFile(file: File): Promise<ExcelPlayerRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

        // Skip header row
        const players: ExcelPlayerRow[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as unknown[];
          if (!row || row.every(c => c === undefined || c === null || c === '')) continue;

          const name = String(row[1] ?? '').trim();
          const club = String(row[2] ?? '').trim();
          const phone = String(row[3] ?? '').trim();
          const email = String(row[4] ?? '').trim();
          const points = Number(row[5] ?? 0);

          const errors: string[] = [];
          if (!name) errors.push('Thiếu họ tên');
          if (!phone) errors.push('Thiếu số điện thoại');
          if (isNaN(points)) errors.push('Điểm xếp hạng không hợp lệ');

          players.push({
            stt: Number(row[0]) || i,
            name,
            club,
            phone,
            email,
            rankingPoints: isNaN(points) ? 0 : points,
            error: errors.length > 0 ? errors.join(', ') : undefined,
          });
        }
        resolve(players);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

export function exportPlayersToExcel(players: { name: string; club: string; phone: string; email: string; rankingPoints: number; seed: number | null }[]): void {
  const data = [
    ['STT', 'Họ và tên', 'Câu lạc bộ', 'Số điện thoại', 'Email', 'Điểm xếp hạng', 'Hạt giống'],
    ...players.map((p, i) => [i + 1, p.name, p.club, p.phone, p.email, p.rankingPoints, p.seed ?? '']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'VĐV');
  XLSX.writeFile(wb, 'danh-sach-vdv.xlsx');
}
