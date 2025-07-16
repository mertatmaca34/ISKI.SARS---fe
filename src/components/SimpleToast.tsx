import React, { useEffect } from 'react';

interface SimpleToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

export const SimpleToast: React.FC<SimpleToastProps> = ({ message, open, onClose }) => {
  useEffect(() => {
    if (open) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50">
      <div className="bg-green-100 text-green-800 border border-green-300 rounded-lg px-4 py-2 flex items-start space-x-2">
        <span className="flex-1 text-sm">{message}</span>
        <button onClick={onClose} className="text-green-800">×</button>
      </div>
    </div>
  );
};
