import React, { useEffect, useState } from 'react';
import { OperationClaimDto } from '../services';

interface RoleSelectToastProps {
  open: boolean;
  claims: OperationClaimDto[];
  defaultClaimId?: number;
  onConfirm: (claimId: number) => void;
  onCancel: () => void;
}

export const RoleSelectToast: React.FC<RoleSelectToastProps> = ({
  open,
  claims,
  defaultClaimId,
  onConfirm,
  onCancel,
}) => {
  const [claimId, setClaimId] = useState(defaultClaimId || 0);

  useEffect(() => {
    setClaimId(defaultClaimId ?? claims[0]?.id ?? 0);
  }, [defaultClaimId, claims]);

  if (!open) return null;

  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-2">
        <select
          value={claimId}
          onChange={(e) => setClaimId(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-md"
        >
          {claims.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => onConfirm(claimId)}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          Kaydet
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
        >
          İptal
        </button>
      </div>
    </div>
  );
};
