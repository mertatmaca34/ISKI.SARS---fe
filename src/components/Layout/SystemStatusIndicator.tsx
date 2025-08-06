import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { dashboardService } from '../../services';
import { SystemMetric } from '../../types';

const normalizeStatus = (status: string) => {
  const s = status.toLowerCase();
  if (['bad', 'critical', 'error', 'failed', 'disconnected'].includes(s)) return 'bad';
  if (['warning', 'degraded'].includes(s)) return 'warning';
  return 'good';
};

const getBannerMessage = (metric: SystemMetric) => {
  const name = metric.name.toLowerCase();
  if (name.includes('opc')) return 'OPC bağlantısı yok';
  if (name.includes('internet')) return 'İnternet kesildi';
  return `${metric.name} hatası`;
};

export const SystemStatusIndicator: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);

  useEffect(() => {
    dashboardService
      .metrics()
      .then(setMetrics)
      .catch(() => setMetrics([]));
  }, []);

  const badMetric = metrics.find(m => normalizeStatus(m.status) === 'bad');
  const warningMetric = metrics.find(m => normalizeStatus(m.status) === 'warning');

  if (badMetric) {
    return (
      <div className="flex items-center text-red-600 text-sm">
        <AlertTriangle className="h-5 w-5 mr-1" />
        {getBannerMessage(badMetric)}
      </div>
    );
  }

  if (warningMetric) {
    return (
      <div className="flex items-center text-yellow-600 text-sm">
        <AlertTriangle className="h-5 w-5 mr-1" />
        {getBannerMessage(warningMetric)}
      </div>
    );
  }

  return (
    <div className="flex items-center text-green-600 text-sm">
      <CheckCircle className="h-5 w-5 mr-1" />
      Sistem Sağlıklı
    </div>
  );
};

