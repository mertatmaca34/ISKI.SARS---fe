import React from 'react';
import {
  BarChart3,
  FileText,
  Tags,
  Users,
  Settings,
  Activity,
  Shield,
  Key,
  UserCog
} from 'lucide-react';
import { authStore } from '../../store/authStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const currentUser = authStore.getCurrentUser();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'operator'] },
    { id: 'templates', label: 'Rapor Şablonları', icon: FileText, roles: ['admin', 'operator'] },
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
    <div className="w-64 bg-gray-800 min-h-screen">
      <div className="p-4">
        <div className="mb-8" />
        
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};