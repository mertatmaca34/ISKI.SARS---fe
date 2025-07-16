import React, { useEffect, useState } from 'react';
import { permissionController, RoleCounts } from '../../controllers/permissionController';

export const OperationClaimList: React.FC = () => {
  const [counts, setCounts] = useState<RoleCounts | null>(null);

  useEffect(() => {
    permissionController
      .getRoleCounts({ index: 0, size: 100 })
      .then(res => setCounts(res))
      .catch(() => setCounts(null));
  }, []);

  const hasUsers = counts && counts.total > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yetkiler</h1>
      </div>
      {hasUsers && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı Sayısı
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {counts?.admin ?? 0}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Operator</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {counts?.operator ?? 0}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Beklemede</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {counts?.pending ?? 0}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Toplam Kullanıcılar</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {counts?.total ?? 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {(!hasUsers) && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç kullanıcı bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
