import React, { useState } from 'react';
import { OperationClaimList } from '../OperationClaims/OperationClaimList';
import { UserOperationClaimList } from '../UserOperationClaims/UserOperationClaimList';
import { SimpleUserList } from '../Users/SimpleUserList';

type Section = 'operationclaims' | 'useroperationclaims' | 'users';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'operationclaims', label: 'Yetkiler' },
  { id: 'useroperationclaims', label: 'Kullanıcı Yetkileri' },
  { id: 'users', label: 'Kullanıcı Yönetimi' }
];

export const UserManagementHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(SECTIONS[0].id);

  const renderSection = () => {
    switch (activeSection) {
      case 'operationclaims':
        return <OperationClaimList />;
      case 'useroperationclaims':
        return <UserOperationClaimList />;
      case 'users':
      default:
        return <SimpleUserList />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-2">
        <nav
          className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-wrap overflow-hidden"
          role="tablist"
          aria-label="Kullanıcı ve Yetki Yönetimi"
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              role="tab"
              aria-selected={activeSection === section.id}
              className={`flex-1 min-w-[160px] px-4 py-3 text-sm font-medium transition-colors focus:outline-none border-r border-gray-200 last:border-r-0 ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
      <div>{renderSection()}</div>
    </div>
  );
};
