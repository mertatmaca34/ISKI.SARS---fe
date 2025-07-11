import React, { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TemplateList } from './components/Templates/TemplateList';
import { TagList } from './components/Tags/TagList';
import { UserList } from './components/Users/UserList';
import { LogList } from './components/Logs/LogList';
import { Settings } from './components/Settings/Settings';
import { InstantValueList } from './components/InstantValues/InstantValueList';
import { OperationClaimList } from './components/OperationClaims/OperationClaimList';
import { UserOperationClaimList } from './components/UserOperationClaims/UserOperationClaimList';
import { UserSettings } from './components/Users/UserSettings';
import { authStore } from './store/authStore';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authStore.getIsAuthenticated());
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authStore.logout();
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'templates':
        return <TemplateList />;
      case 'tags':
        return <TagList />;
      case 'instantvalues':
        return <InstantValueList />;
      case 'operationclaims':
        return <OperationClaimList />;
      case 'useroperationclaims':
        return <UserOperationClaimList />;
      case 'users':
        return <UserList />;
      case 'logs':
        return <LogList />;
      case 'settings':
        return <Settings />;
      case 'user-settings':
        return <UserSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} onOpenUserSettings={() => setActiveTab('user-settings')} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
