import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { authStore } from '../../store/authStore';

interface HeaderProps {
  onLogout: () => void;
  onOpenUserSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, onOpenUserSettings }) => {
  const currentUser = authStore.getCurrentUser();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">İSKİ SARS</h1>
                <p className="text-sm text-gray-500">Sistem Aktif Rapor Sistemi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenUserSettings}
              className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 px-2 py-1 rounded-md"
            >
              <User className="h-5 w-5 text-gray-400" />
              <div className="text-sm text-left">
                <div className="font-medium text-gray-900">{currentUser?.username}</div>
                <div className="text-gray-500 capitalize">{currentUser?.role}</div>
              </div>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};