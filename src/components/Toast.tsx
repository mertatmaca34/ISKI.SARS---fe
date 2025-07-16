import React, { useEffect } from 'react';

interface ToastProps {
  open: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ open, message, type = 'info', onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const colorMap = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  } as const;

  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50">
      <div className={`text-white px-4 py-2 rounded shadow-md ${colorMap[type]}`}>{message}</div>
    </div>
  );
};
