import React, { useEffect, useState } from 'react';
import { logService } from '../../services';
import { LogDto, LogLevel } from '../../types';

export const LogList: React.FC = () => {
  const [logs, setLogs] = useState<LogDto[]>([]);

  useEffect(() => {
    logService
      .list({ index: 0, size: 50 })
      .then((res) => setLogs(res.items))
      .catch(() => setLogs([]));
  }, []);

  const levelToString = (level: LogLevel) => LogLevel[level];

  return (
    <div className="space-y-6 px-2">
      <h1 className="text-2xl font-semibold text-gray-900">Loglar</h1>
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
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {levelToString(log.level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.createdAt).toLocaleString()}
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
