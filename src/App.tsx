import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TemplateList } from './components/Templates/TemplateList';
import { TemplateEditForm } from './components/Templates/TemplateEditForm';
import { TagList } from './components/Tags/TagList';
import { SimpleUserList } from './components/Users/SimpleUserList';
import { UserEditForm } from './components/Users/UserEditForm';
import { LogList } from './components/Logs/LogList';
import { Settings } from './components/Settings/Settings';
import { TemplateTagManager } from './components/Templates/TemplateTagManager';
import { OperationClaimList } from './components/OperationClaims/OperationClaimList';
import { UserOperationClaimList } from './components/UserOperationClaims/UserOperationClaimList';
import { UserSettings } from './components/Users/UserSettings';
import { ArchiveTagList } from './components/ArchiveTags/ArchiveTagList';
import { authStore } from './store/authStore';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authStore.getIsAuthenticated());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  const isTagsTab = activeTab === 'tags';

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
      case 'archive-tags':
        return <ArchiveTagList />;
      case 'tags':
        return <TagList />;
      case 'operationclaims':
        return <OperationClaimList />;
      case 'useroperationclaims':
        return <UserOperationClaimList />;
      case 'users':
        return <SimpleUserList />;
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
    if (route === '/register') {
      return <RegisterForm onBack={() => navigate('/')} />;
    }
    return <LoginForm onLogin={handleLogin} onShowRegister={() => navigate('/register')} />;
  }

  if (route.startsWith('/Templates/Edit/')) {
    const id = parseInt(route.split('/').pop() || '0', 10);
    return (
      <div className="h-screen overflow-hidden bg-gray-50">
        <Header onLogout={handleLogout} onOpenUserSettings={() => setActiveTab('user-settings')} />
        <div className="flex">
          <Sidebar activeTab="templates" onTabChange={(tab) => { setActiveTab(tab); navigate('/'); }} />
          <main className="flex-1 p-4">
            <div className="mx-2 max-w-none">
              <TemplateEditForm id={id} onSuccess={() => navigate('/Templates')} onCancel={() => navigate('/Templates')} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (route.startsWith('/Users/Edit/')) {
    const id = route.split('/').pop() || '';
    return (
      <div className="h-screen overflow-hidden bg-gray-50">
        <Header onLogout={handleLogout} onOpenUserSettings={() => setActiveTab('user-settings')} />
        <div className="flex">
          <Sidebar activeTab="users" onTabChange={(tab) => { setActiveTab(tab); navigate('/'); }} />
          <main className="flex-1 p-4">
            <div className="mx-2 max-w-none">
              <UserEditForm id={id} onSuccess={() => navigate('/Users')} onCancel={() => navigate('/Users')} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (route.startsWith('/Templates/') && route.endsWith('/Tags')) {
    const id = parseInt(route.split('/')[2] || '0', 10);
    return (
      <div className="h-screen overflow-hidden bg-gray-50">
        <Header onLogout={handleLogout} onOpenUserSettings={() => setActiveTab('user-settings')} />
        <div className="flex">
          <Sidebar activeTab="templates" onTabChange={(tab) => { setActiveTab(tab); navigate('/'); }} />
          <main className="flex-1 p-4">
            <div className="mx-2 max-w-none">
              <TemplateTagManager templateId={id} onBack={() => navigate('/Templates')} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isTagsTab ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-gray-50`}>
      <Header onLogout={handleLogout} onOpenUserSettings={() => setActiveTab('user-settings')} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-4">
          <div className="mx-2 max-w-none">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;