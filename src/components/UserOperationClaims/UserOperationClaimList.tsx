import React, { useEffect, useState } from 'react';
import { userOperationClaimService, UserOperationClaimDto } from '../../services';

export const UserOperationClaimList: React.FC = () => {
  const [claims, setClaims] = useState<UserOperationClaimDto[]>([]);

  useEffect(() => {
    userOperationClaimService
      .list({ pageNumber: 0, pageSize: 50 })
      .then((res) => setClaims(res.items))
      .catch(() => setClaims([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kullanıcı Yetkileri</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yetki ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.operationClaimId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {claims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç yetki ataması bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
