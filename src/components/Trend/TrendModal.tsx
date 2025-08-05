import React, { useCallback, useEffect, useState } from 'react';
import {
  ArchiveTagDto,
  trendService,
  TrendPoint,
} from '../../services';

interface TrendModalProps {
  tag: ArchiveTagDto;
  onClose: () => void;
}

export const TrendModal: React.FC<TrendModalProps> = ({ tag, onClose }) => {
  const [start, setStart] = useState(() => {
    const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [end, setEnd] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [realtime, setRealtime] = useState(false);

  const loadData = useCallback(() => {
    trendService
      .get(tag, start + ':00Z', end + ':00Z')
      .then((res) => setPoints(res.points ?? []))
      .catch(() => setPoints([]));
  }, [tag, start, end]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!realtime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const s = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      setStart(s.toISOString().slice(0, 16));
      setEnd(now.toISOString().slice(0, 16));
      loadData();
    }, tag.pullInterval * 1000);
    return () => clearInterval(interval);
  }, [realtime, tag, loadData]);

  const max = points.length ? Math.max(...points.map((p) => p.value)) : 0;
  const min = points.length ? Math.min(...points.map((p) => p.value)) : 0;
  const avg = points.length
    ? points.reduce((s, p) => s + p.value, 0) / points.length
    : 0;

  const handleLast24h = () => {
    const now = new Date();
    const s = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setStart(s.toISOString().slice(0, 16));
    setEnd(now.toISOString().slice(0, 16));
  };

  const handleExport = () => {
    const content = document.getElementById('trend-modal-content');
    if (!content) return;
    const win = window.open('', '', 'width=800,height=600');
    if (!win) return;
    win.document.write(
      '<html><head><title>Trend</title></head><body>' +
        content.innerHTML +
        '</body></html>'
    );
    win.document.close();
    win.print();
  };

  const maxValue = Math.max(...points.map((d) => d.value), 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4" id="trend-modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{tag.tagName} Trend</h2>
          <button onClick={onClose} className="text-gray-500">X</button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><span className="font-medium">Node Id:</span> {tag.tagNodeId}</div>
          <div><span className="font-medium">Açıklama:</span> {tag.description ?? '-'}</div>
          <div><span className="font-medium">Kayıt Aralığı:</span> {tag.pullInterval}s</div>
        </div>

        <div className="flex space-x-2 items-end mb-4">
          <div>
            <label className="text-xs">Başlangıç</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded p-1"
            />
          </div>
          <div>
            <label className="text-xs">Bitiş</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border rounded p-1"
            />
          </div>
          <button
            onClick={handleLast24h}
            className="bg-blue-600 text-white px-2 py-1 rounded"
          >
            Son 24 Saat
          </button>
          <label className="flex items-center space-x-1 text-xs">
            <input
              type="checkbox"
              checked={realtime}
              onChange={(e) => setRealtime(e.target.checked)}
            />
            <span>Gerçek Zamanlı</span>
          </label>
          <button
            onClick={handleExport}
            className="ml-auto bg-green-600 text-white px-2 py-1 rounded"
          >
            PDF
          </button>
        </div>

        <div className="relative h-48 mb-4">
          <svg viewBox="0 0 400 200" className="w-full h-full">
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
            <polyline
              points={points
                .map((d, i) => `${(i * (400 / Math.max(points.length - 1, 1)))},${200 - (d.value / maxValue) * 160}`)
                .join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            {points.map((d, i) => (
              <circle
                key={d.timestamp}
                cx={i * (400 / Math.max(points.length - 1, 1))}
                cy={200 - (d.value / maxValue) * 160}
                r="4"
                fill="#3b82f6"
              />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
            {points.map((d) => (
              <span key={d.timestamp}>
                {new Date(d.timestamp).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-sm">
          <div><span className="font-medium">Max:</span> {max}</div>
          <div><span className="font-medium">Min:</span> {min}</div>
          <div><span className="font-medium">Ortalama:</span> {avg.toFixed(2)}</div>
          <div><span className="font-medium">Toplam:</span> {points.length}</div>
        </div>
      </div>
    </div>
  );
};

