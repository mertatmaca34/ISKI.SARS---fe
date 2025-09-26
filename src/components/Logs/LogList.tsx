import React, { useEffect, useState } from 'react';
import { logService } from '../../services';
import { LogDto, LogLevel } from '../../types';

export const LogList: React.FC = () => {
  const [logs, setLogs] = useState<LogDto[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [level, setLevel] = useState('');

  const logLevelLabels: Record<LogLevel, string> = {
    [LogLevel.Trace]: 'İzleme',
    [LogLevel.Debug]: 'Hata Ayıklama',
    [LogLevel.Info]: 'Bilgi',
    [LogLevel.Warn]: 'Uyarı',
    [LogLevel.Error]: 'Hata',
    [LogLevel.Fatal]: 'Kritik Hata',
  };

  const logLevelOptions = Object.values(LogLevel).filter(
    (value): value is LogLevel => typeof value === 'number'
  );

  useEffect(() => {
    logService
      .list({ index: 0, size: 50 })
      .then((res) => setLogs(res.items))
      .catch(() => setLogs([]));
  }, []);

  const levelToString = (value: LogLevel) =>
    logLevelLabels[value] ?? LogLevel[value];

  const filteredLogs = logs.filter((log) => {
    const date = new Date(log.createdAt);
    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate)) return false;
    if (level && log.level !== Number(level)) return false;
    return true;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const diff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? diff : -diff;
  });

  return (
    <div className="space-y-6 px-2">
      <h1 className="text-2xl font-semibold text-gray-900">Loglar</h1>

      <div className="flex flex-wrap gap-4 w-full">
        <div>
          <label className="block text-sm text-gray-700">Başlangıç</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Bitiş</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Seviye</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="">Tümü</option>
            {logLevelOptions.map((logLevelValue) => (
              <option key={logLevelValue} value={logLevelValue}>
                {levelToString(logLevelValue)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Sıralama</label>
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'asc' | 'desc')
            }
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="desc">Yeni &gt; Eski</option>
            <option value="asc">Eski &gt; Yeni</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seviye</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesaj</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {levelToString(log.level)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 break-all whitespace-normal">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {logs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç log bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
