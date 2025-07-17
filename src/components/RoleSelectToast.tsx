import React, { useEffect, useState } from 'react';
import { OperationClaimDto } from '../services';

interface RoleSelectToastProps {
  open: boolean;
  claims: OperationClaimDto[];
  defaultClaimId?: number;
  anchor?: { top: number; left: number };
  onConfirm: (claimId: number) => void;
  onCancel: () => void;
}

export const RoleSelectToast: React.FC<RoleSelectToastProps> = ({
  open,
  claims,
  defaultClaimId,
  anchor,
  onConfirm,
  onCancel,
}) => {
  const [claimId, setClaimId] = useState(defaultClaimId || 0);

  useEffect(() => {
    setClaimId(defaultClaimId ?? claims[0]?.id ?? 0);
  }, [defaultClaimId, claims]);

  if (!open) return null;

  const containerClass = anchor
    ? 'fixed z-50'
    : 'fixed top-4 inset-x-0 flex justify-center z-50';
  const containerStyle = anchor ? { top: anchor.top, left: anchor.left } : {};
  const innerClass = `bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-2${
    anchor ? ' transform -translate-x-full mr-2' : ''
  }`;

  return (
    <div className={containerClass} style={containerStyle}>
      <div className={innerClass}>
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
