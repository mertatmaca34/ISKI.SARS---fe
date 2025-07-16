import React, { useEffect, useState } from 'react';
import {
  userOperationClaimService,
  UserOperationClaimDto,
  userService,
  operationClaimService,
  UserDto,
  OperationClaimDto,
} from '../../services';

export const UserOperationClaimList: React.FC = () => {
  const [claims, setClaims] = useState<UserOperationClaimDto[]>([]);
  const [users, setUsers] = useState<Record<number, UserDto>>({});
  const [ops, setOps] = useState<Record<number, OperationClaimDto>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [claimRes, userRes, opRes] = await Promise.all([
          userOperationClaimService.list({ index: 0, size: 100 }),
          userService.list({ index: 0, size: 100 }),
          operationClaimService.list({ index: 0, size: 100 }),
        ]);
        setClaims(claimRes.items);
        const uMap: Record<number, UserDto> = {};
        userRes.items.forEach((u) => {
          uMap[Number(u.id)] = u;
        });
        setUsers(uMap);
        const oMap: Record<number, OperationClaimDto> = {};
        opRes.items.forEach((o) => {
          oMap[o.id] = o;
        });
        setOps(oMap);
      } catch {
        setClaims([]);
        setUsers({});
        setOps({});
      }
    };
    load();
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yetki</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {users[claim.userId]?.firstName} {users[claim.userId]?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {users[claim.userId]?.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ops[claim.operationClaimId]?.name}
                  </td>
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
