import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { SystemMetric } from '../../services';

interface SystemStatusProps {
  metrics: SystemMetric[];
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ metrics }) => {
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

  const getStatusIcon = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'bad':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'bad':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'bad':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (metric: SystemMetric) => {
    if (metric.value === 1) {
      return 'Bağlı';
    }
    if (metric.value === 0 && !metric.unit) {
      return 'Bağlı Değil';
    }
    return `${metric.value} ${metric.unit}`.trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div
            key={`${metric.id}-${idx}`}
            className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(metric.status)}
                <div>
                  <p className="font-medium text-gray-900">{metric.name}</p>
                  <p className="text-sm text-gray-500">
                    Son güncelleme: {new Date(metric.lastUpdated).toLocaleTimeString('tr-TR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatValue(metric)}</p>
                <p className={`text-sm font-medium capitalize ${getStatusTextColor(metric.status)}`}>
                  {metric.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};