import React from 'react';

interface ConfirmToastProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmToast: React.FC<ConfirmToastProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-4">
        {title && <h2 className="text-lg font-semibold mr-2">{title}</h2>}
        <p className="text-sm flex-1">{message}</p>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
          >
            Evet
          </button>
        </div>
      </div>
    </div>
  );
};
