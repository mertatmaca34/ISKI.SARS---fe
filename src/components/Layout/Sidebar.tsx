import React, { useState } from 'react';
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  Shield,
  Key,
  UserCog,
  Archive
} from 'lucide-react';
import { authStore } from '../../store/authStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const currentUser = authStore.getCurrentUser();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Anasayfa', icon: BarChart3, roles: ['admin', 'operator'] },
    { id: 'templates', label: 'Rapor Şablonları', icon: FileText, roles: ['admin', 'operator'] },
    { id: 'archive-tags', label: 'Arşivlenecek Etiketler', icon: Archive, roles: ['admin', 'operator'] },
    { id: 'tags', label: 'Etiketler', icon: Tags, roles: ['admin', 'operator'] },
    { id: 'operationclaims', label: 'Yetkiler', icon: Key, roles: ['admin'] },
    { id: 'useroperationclaims', label: 'Kullanıcı Yetkileri', icon: UserCog, roles: ['admin'] },
    { id: 'users', label: 'Kullanıcı Yönetimi', icon: Users, roles: ['admin'] },
    { id: 'logs', label: 'Sistem Logları', icon: Shield, roles: ['admin'] },
    { id: 'settings', label: 'Ayarlar', icon: Settings, roles: ['admin'] }
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(currentUser?.role || '')
  );

  return (
    <div
      className={`bg-gray-800 min-h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center py-2 rounded-md text-left transition-colors ${
                  isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'
                } ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};