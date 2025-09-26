import React, { useEffect, useState } from 'react';
import {
  FileText,
  Tags as TagsIcon,
  Database,
  Activity as ActivityIcon,
  Users,
  AlertTriangle,
  TrendingUp,
  Server,
} from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { SystemStatus } from './SystemStatus';
import { DataChart } from './DataChart';
import { dashboardService, DashboardStats, SystemMetric } from '../../services';

export const SystemInfo: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    activeTags: 0,
    dataPoints24h: 0,
    systemHealth: '',
    activeUsers: 0,
    alerts24h: 0,
    uptime: '',
  });
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);

  const normalizeStatus = (status: string) => {
    const s = status.toLowerCase();
    if (
      [
        'bad',
        'critical',
        'error',
        'failed',
        'disconnected',
        'bağlı değil',
        'bagli degil',
        'kötü',
        'kotu',
        'offline',
      ].includes(s)
    )
      return 'bad';
    if (['warning', 'degraded', 'uyarı', 'uyari'].includes(s)) return 'warning';
    return 'good';
  };

  useEffect(() => {
    dashboardService
      .stats()
      .then(setStats)
      .catch(() => {});
    dashboardService
      .metrics()
      .then(setSystemMetrics)
      .catch(() => {});
  }, []);

  const badMetrics = systemMetrics.filter((m) => normalizeStatus(m.status) === 'bad');

  const getBannerMessage = (metric: SystemMetric) => {
    const name = metric.name.toLowerCase();
    if (name.includes('opc')) return 'OPC bağlantısı yok';
    if (name.includes('internet')) return 'İnternet kesildi';
    return `${metric.name} hatası`;
  };

  const overallSystemHealth = React.useMemo(() => {
    if (systemMetrics.some((m) => normalizeStatus(m.status) === 'bad')) return 'bad';
    if (systemMetrics.some((m) => normalizeStatus(m.status) === 'warning')) return 'warning';
    return 'good';
  }, [systemMetrics]);

  return (
    <div className="space-y-6">
      {badMetrics.map((m, idx) => (
        <div
          key={`${m.id}-${idx}`}
          className="bg-red-100 text-red-800 px-4 py-2 rounded"
        >
          ❗ {getBannerMessage(m)}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sistem Bilgileri</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ActivityIcon className="h-4 w-4" />
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
          icon={TagsIcon}
          color="green"
        />
        <DashboardCard
          title="24s Veri Noktası"
          value={stats.dataPoints24h.toLocaleString()}
          icon={Database}
          color="blue"
        />
        <DashboardCard
          title="Sistem Çalışma Süresi"
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
          value={
            overallSystemHealth === 'good'
              ? 'Sağlıklı'
              : overallSystemHealth === 'warning'
                ? 'Uyarı'
                : 'Sağlıksız'
          }
          icon={Server}
          color={
            overallSystemHealth === 'good'
              ? 'green'
              : overallSystemHealth === 'warning'
                ? 'yellow'
                : 'red'
          }
        />
      </div>
    </div>
  );
};

