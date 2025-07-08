import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { SystemMetric } from '../../types';

interface SystemStatusProps {
  metrics: SystemMetric[];
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ metrics }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}>
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
                <p className="font-semibold text-gray-900">
                  {metric.value} {metric.unit}
                </p>
                <p className={`text-sm font-medium capitalize ${
                  metric.status === 'healthy' ? 'text-green-600' : 
                  metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.status === 'healthy' ? 'Sağlıklı' : 
                   metric.status === 'warning' ? 'Uyarı' : 'Kritik'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};