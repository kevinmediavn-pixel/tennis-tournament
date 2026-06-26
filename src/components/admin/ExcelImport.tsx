import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { parseExcelFile } from '../../utils/excelParser';
import { importPlayers } from '../../firebase/firestore';
import type { ExcelPlayerRow } from '../../types';

export default function ExcelImport({ tournamentId }: { tournamentId: string }) {
  const [preview, setPreview] = useState<ExcelPlayerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDone(false);
    try {
      const rows = await parseExcelFile(file);
      setPreview(rows);
    } catch {
      alert('Không đọc được file. Vui lòng kiểm tra định dạng Excel.');
    }
  };

  const handleImport = async () => {
    const valid = preview.filter(r => !r.error);
    if (!valid.length) return;
    setLoading(true);
    try {
      await importPlayers(tournamentId, valid.map(r => ({
        name: r.name, phone: r.phone, email: r.email,
        club: r.club, rankingPoints: r.rankingPoints,
      })));
      setPreview([]);
      setDone(true);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      alert('Lỗi khi import. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const validCount = preview.filter(r => !r.error).length;
  const errorCount = preview.filter(r => !!r.error).length;

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1B5E20] transition-colors">
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">Tải lên file Excel (.xlsx)</p>
        <p className="text-xs text-gray-400 mb-3">STT | Họ tên | CLB | SĐT | Email | Điểm xếp hạng</p>
        <input ref={inputRef} type="file" accept=".xlsx,.xls" onChange={handleFile}
          className="hidden" id="excel-upload" />
        <label htmlFor="excel-upload"
          className="cursor-pointer inline-block px-4 py-2 bg-[#1B5E20] text-white text-sm rounded-lg hover:bg-[#2E7D32]">
          Chọn file
        </label>
      </div>

      {done && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 text-sm">
          <CheckCircle className="w-4 h-4" />
          Import thành công!
        </div>
      )}

      {preview.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              Xem trước: <span className="text-green-600 font-medium">{validCount} hợp lệ</span>
              {errorCount > 0 && <span className="text-red-500 ml-2">{errorCount} lỗi</span>}
            </p>
            <button onClick={handleImport} disabled={loading || validCount === 0}
              className="px-4 py-1.5 bg-[#1B5E20] text-white text-sm rounded-lg hover:bg-[#2E7D32] disabled:opacity-50">
              {loading ? 'Đang import...' : `Import ${validCount} VĐV`}
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">STT</th>
                  <th className="px-3 py-2 text-left">Họ tên</th>
                  <th className="px-3 py-2 text-left">CLB</th>
                  <th className="px-3 py-2 text-left">SĐT</th>
                  <th className="px-3 py-2 text-right">Điểm</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((r, i) => (
                  <tr key={i} className={r.error ? 'bg-red-50' : ''}>
                    <td className="px-3 py-2">{r.stt}</td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2 text-gray-500">{r.club}</td>
                    <td className="px-3 py-2 text-gray-500">{r.phone}</td>
                    <td className="px-3 py-2 text-right font-mono">{r.rankingPoints}</td>
                    <td className="px-3 py-2">
                      {r.error && (
                        <span title={r.error} className="text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
