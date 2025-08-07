import React, { useState } from 'react';
import { TrendDashboard } from '../Trend/TrendDashboard';
import { SystemInfo } from './SystemInfo';

export const Dashboard: React.FC = () => {
  const [tab, setTab] = useState<'trend' | 'system'>('trend');

  const tabClass = (t: 'trend' | 'system') =>
    'px-3 py-2 text-sm font-medium rounded-t-md border-b-2 focus:outline-none ' +
    (tab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500');

  return (
    <div className="px-2">
      <div className="border-b mb-4">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button className={tabClass('trend')} onClick={() => setTab('trend')}>
            Trend
          </button>
          <button className={tabClass('system')} onClick={() => setTab('system')}>
            Sistem Bilgileri
          </button>
        </nav>
      </div>
      {tab === 'trend' ? <TrendDashboard /> : <SystemInfo />}
    </div>
  );
};

