import React from 'react';
import { 
  FileText, 
  Tags, 
  Database, 
  Activity, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Server
} from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { SystemStatus } from './SystemStatus';
import { DataChart } from './DataChart';
import { dataStore } from '../../store/dataStore';

export const Dashboard: React.FC = () => {
  const stats = dataStore.getDashboardStats();
  const systemMetrics = dataStore.getSystemMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="h-4 w-4" />
          <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Toplam Şablon"
          value={stats.totalTemplates}
          icon={FileText}
          color="blue"
        />
        <DashboardCard
          title="Aktif Etiket"
          value={stats.activeTags}
          icon={Tags}
          color="green"
        />
        <DashboardCard
          title="24s Veri Noktası"
          value={stats.dataPoints24h.toLocaleString()}
          icon={Database}
          color="blue"
        />
        <DashboardCard
          title="Sistem Uptime"
          value={stats.uptime}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* System Status and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemStatus metrics={systemMetrics} />
        <DataChart />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Aktif Kullanıcı"
          value={stats.activeUsers}
          icon={Users}
          color="blue"
        />
        <DashboardCard
          title="24s Uyarı"
          value={stats.alerts24h}
          icon={AlertTriangle}
          color="yellow"
        />
        <DashboardCard
          title="Sistem Durumu"
          value={stats.systemHealth === 'healthy' ? 'Sağlıklı' : 'Uyarı'}
          icon={Server}
          color={stats.systemHealth === 'healthy' ? 'green' : 'yellow'}
        />
      </div>
    </div>
  );
};