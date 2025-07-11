import React, { useEffect, useState } from 'react';
import { instantValueService, InstantValueDto } from '../../services';

export const InstantValueList: React.FC = () => {
  const [values, setValues] = useState<InstantValueDto[]>([]);

  useEffect(() => {
    instantValueService
      .list({ index: 0, size: 50 })
      .then((res) => setValues(res.items))
      .catch(() => setValues([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Anlık Değerler</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zaman Damgası
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {values.map((val) => (
                <tr key={val.timestamp + val.reportTemplateTagId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {val.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {val.reportTemplateTagId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {val.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {val.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {values.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç veri bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
