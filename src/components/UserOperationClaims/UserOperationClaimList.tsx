import React, { useEffect, useState } from 'react';
import {
  userOperationClaimService,
  UserOperationClaimDto,
  userService,
  operationClaimService,
  UserDto,
  OperationClaimDto,
} from '../../services';
import { SimpleToast } from '../SimpleToast';
import { RoleSelectToast } from '../RoleSelectToast';

export const UserOperationClaimList: React.FC = () => {
  const [claims, setClaims] = useState<UserOperationClaimDto[]>([]);
  const [users, setUsers] = useState<Record<string, UserDto>>({});
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
        const uMap: Record<string, UserDto> = {};
        userRes.items.forEach((u) => {
          uMap[u.id] = u;
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

  const [dialogClaim, setDialogClaim] = useState<UserOperationClaimDto | null>(
    null
  );
  const [availableClaims, setAvailableClaims] = useState<OperationClaimDto[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPos, setDialogPos] = useState<{ top: number; left: number }>();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const openDialog = async (
    claim: UserOperationClaimDto,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDialogPos({ top: rect.top, left: rect.left });
    try {
      const res = await operationClaimService.list({ index: 0, size: 10 });
      setAvailableClaims(res.items);
      setDialogClaim(claim);
      setShowDialog(true);
    } catch {
      setAvailableClaims([]);
    }
  };

  const handleChangeClaim = async (operationClaimId: number) => {
    if (!dialogClaim) return;
    try {
      await userOperationClaimService.update({
        id: dialogClaim.id,
        userId: dialogClaim.userId,
        operationClaimId,
      });
      setClaims((current) =>
        current.map((c) =>
          c.id === dialogClaim.id ? { ...c, operationClaimId } : c
        )
      );
      setToastMessage('Yetki başarıyla güncellendi.');
      setShowToast(true);
    } catch {
      // ignore for now
    } finally {
      setShowDialog(false);
      setDialogClaim(null);
      setDialogPos(undefined);
    }
  };

  const renderGroup = (name: string) => {
    const group = claims.filter(
      (c) => ops[c.operationClaimId]?.name.toLowerCase() === name.toLowerCase()
    );
    if (group.length === 0) return null;
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold mt-4">{name}</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {group.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {users[claim.userId]?.firstName} {users[claim.userId]?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {users[claim.userId]?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={(e) => openDialog(claim, e)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {name.toLowerCase() === 'beklemede' ? 'Yetki Ver' : 'Yetki Değiştir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kullanıcı Yetkileri</h1>
      </div>
      {renderGroup('Admin')}
      {renderGroup('Operator')}
      {renderGroup('Beklemede')}
      {claims.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç yetki ataması bulunamadı.</p>
        </div>
      )}
      <RoleSelectToast
        open={showDialog}
        claims={availableClaims}
        defaultClaimId={dialogClaim?.operationClaimId}
        anchor={dialogPos}
        onConfirm={handleChangeClaim}
        onCancel={() => {
          setShowDialog(false);
          setDialogPos(undefined);
        }}
      />
      <SimpleToast
        message={toastMessage}
        open={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
