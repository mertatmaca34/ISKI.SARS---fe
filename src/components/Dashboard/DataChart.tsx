import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  instantValueService,
  InstantValueDto,
  DynamicQuery,
} from '../../services';

interface ChartPoint {
  time: string;
  value: number;
}

export const DataChart: React.FC = () => {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(start.getHours() - 24, 0, 0, 0);
    const end = new Date(now);
    end.setMinutes(59, 59, 999);

    const query: DynamicQuery = {
      filters: [
        {
          field: 'timestamp',
          operator: 'GreaterThanOrEqual',
          value: start.toISOString(),
        },
        {
          field: 'timestamp',
          operator: 'LessThanOrEqual',
          value: end.toISOString(),
        },
      ],
      sorts: [{ field: 'timestamp', direction: 'asc' }],
    };

    instantValueService
      .list({ index: 0, size: 2000 }, query)
      .then((response) => {
        if (!response || !Array.isArray(response.items)) {
          console.error('API response structure is invalid', response);
          setData([]);
          return;
        }

        const items = response.items as InstantValueDto[];
        const counts: Record<string, number> = {};

        items.forEach((item) => {
          const date = new Date(item.timestamp);
          date.setMinutes(0, 0, 0);
          const key = date.toISOString().slice(0, 13);
          counts[key] = (counts[key] ?? 0) + 1;
        });

        const points: ChartPoint[] = [];
        for (let i = 23; i >= 0; i--) {
          const hourDate = new Date(now.getTime() - i * 3600 * 1000);
          const key = hourDate.toISOString().slice(0, 13);
          const label = hourDate
            .toLocaleTimeString('tr-TR', { hour: '2-digit', hour12: false })
            .padStart(2, '0');
          points.push({ time: label, value: counts[key] ?? 0 });
        }

        setData(points);
      })
      .catch((err) => {
        console.error('API error:', err);
        setData([]);
      });
  }, []);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

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
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`grid-${i}`}
              x1="0"
              y1={40 * i}
              x2="400"
              y2={40 * i}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}

          <polyline
            points={data
              .map(
                (d, i) =>
                  `${(i * (400 / Math.max(data.length - 1, 1)))},${
                    200 - (d.value / maxValue) * 160
                  }`
              )
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {data.map((d, i) => (
            <circle
              key={`point-${d.time}`}
              cx={i * (400 / Math.max(data.length - 1, 1))}
              cy={200 - (d.value / maxValue) * 160}
              r="4"
              fill="#3b82f6"
            />
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
          {data.map((d) => (
            <span key={`label-${d.time}`}>{d.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
