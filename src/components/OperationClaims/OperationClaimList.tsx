import React, { useEffect, useState } from 'react';
import {
  OperationClaimDto,
  operationClaimService,
  userOperationClaimService,
  userService,
  UserDto,
} from '../../services';

export const OperationClaimList: React.FC = () => {
  const [claims, setClaims] = useState<OperationClaimDto[]>([]);
  const [claimUsers, setClaimUsers] = useState<Record<number, UserDto[]>>({});
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [claimRes, userClaimRes, userRes] = await Promise.all([
          operationClaimService.list({ index: 0, size: 100 }),
          userOperationClaimService.list({ index: 0, size: 100 }),
          userService.list({ index: 0, size: 100 }),
        ]);
        setClaims(claimRes.items);
        const userMap: Record<number, UserDto> = {};
        userRes.items.forEach((u) => {
          userMap[Number(u.id)] = u;
        });
        const grouped: Record<number, UserDto[]> = {};
        userClaimRes.items.forEach((uc) => {
          const user = userMap[uc.userId];
          if (user) {
            if (!grouped[uc.operationClaimId]) grouped[uc.operationClaimId] = [];
            grouped[uc.operationClaimId].push(user);
          }
        });
        setClaimUsers(grouped);
      } catch {
        setClaims([]);
        setClaimUsers({});
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Yetkiler</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kişi Sayısı</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <React.Fragment key={claim.id}>
                  <tr
                    onClick={() => setOpenId(openId === claim.id ? null : claim.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claimUsers[claim.id]?.length || 0}</td>
                  </tr>
                  {openId === claim.id &&
                    claimUsers[claim.id]?.map((user) => (
                      <tr key={user.id} className="bg-gray-50">
                        <td colSpan={2} className="px-6 py-2 text-sm text-gray-700">
                          {user.firstName} {user.lastName} - {user.email}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {claims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç yetki bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
