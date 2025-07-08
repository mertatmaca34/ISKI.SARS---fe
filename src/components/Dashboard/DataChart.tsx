import React from 'react';
import { TrendingUp } from 'lucide-react';

export const DataChart: React.FC = () => {
  // Mock data for demonstration
  const data = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 52 },
    { time: '08:00', value: 68 },
    { time: '12:00', value: 85 },
    { time: '16:00', value: 92 },
    { time: '20:00', value: 78 },
    { time: '24:00', value: 65 }
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Veri Akış Grafiği</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>Son 24 Saat</span>
        </div>
      </div>
      
      <div className="relative h-48">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={40 * i}
              x2="400"
              y2={40 * i}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            points={data.map((d, i) => `${(i * 66.67)},${200 - (d.value / maxValue) * 160}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={i * 66.67}
              cy={200 - (d.value / maxValue) * 160}
              r="4"
              fill="#3b82f6"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
          {data.map((d, i) => (
            <span key={i}>{d.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
};