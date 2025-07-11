import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onOpenUserSettings: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  onOpenUserSettings,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} onOpenUserSettings={onOpenUserSettings} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
