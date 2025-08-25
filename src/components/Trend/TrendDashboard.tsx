import React, { useCallback, useEffect, useState } from 'react';
import {
  archiveTagService,
  ArchiveTagDto,
  trendService,
  TrendPoint,
} from '../../services';

export const TrendDashboard: React.FC = () => {
  const [tags, setTags] = useState<ArchiveTagDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [tagToAdd, setTagToAdd] = useState<number | ''>('');
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

  useEffect(() => {
    archiveTagService
      .list({ index: 0, size: 100 })
      .then((res) => setTags(res.items))
      .catch(() => setTags([]));
  }, []);

  const activeTag = tags.find((t) => t.id === activeId) || null;

  const loadData = useCallback(() => {
    if (!activeTag) return;
    trendService
      .get(activeTag, start + ':00Z', end + ':00Z')
      .then((res) => setPoints(res.points ?? []))
      .catch(() => setPoints([]));
  }, [activeTag, start, end]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
      if (!realtime || !activeTag) return;
      const interval = setInterval(() => {
        const now = new Date();
        const s = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        setStart(s.toISOString().slice(0, 16));
        setEnd(now.toISOString().slice(0, 16));
        loadData();
      }, 5000);
      return () => clearInterval(interval);
    }, [realtime, activeTag, loadData]);

  const handleAddTag = () => {
    if (tagToAdd === '' || selectedIds.includes(tagToAdd as number)) return;
    if (selectedIds.length >= 5) return;
    const id = Number(tagToAdd);
    setSelectedIds([...selectedIds, id]);
    setActiveId(id);
    setTagToAdd('');
  };

  const selectedTags = tags.filter((t) => selectedIds.includes(t.id));

  const handleLast24h = () => {
    const now = new Date();
    const s = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setStart(s.toISOString().slice(0, 16));
    setEnd(now.toISOString().slice(0, 16));
  };

  const handleExport = () => {
    const content = document.getElementById('trend-dashboard-content');
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

  const max = points.length ? Math.max(...points.map((p) => p.value)) : 0;
  const min = points.length ? Math.min(...points.map((p) => p.value)) : 0;
  const avg = points.length
    ? points.reduce((s, p) => s + p.value, 0) / points.length
    : 0;
  const maxValue = Math.max(...points.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Trend Analiz</h1>
        {activeTag && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex space-x-2 items-end">
          <select
            value={tagToAdd}
            onChange={(e) =>
              setTagToAdd(e.target.value ? Number(e.target.value) : '')
            }
            className="border rounded p-2"
          >
            <option value="">Etiket seç...</option>
            {tags
              .filter((t) => !selectedIds.includes(t.id))
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tagName}
                </option>
              ))}
          </select>
          <button
            onClick={handleAddTag}
            disabled={tagToAdd === '' || selectedIds.length >= 5}
            className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50"
          >
            Ekle
          </button>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-3 py-1 rounded ${
                activeId === t.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {t.tagName}
            </button>
          ))}
        </div>
      )}

      {activeTag ? (
        <div id="trend-dashboard-content" className="space-y-4">
          <div className="flex flex-wrap gap-2 items-end">
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

          <div className="relative h-64">
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
                  .map(
                    (d, i) =>
                      `${i * (400 / Math.max(points.length - 1, 1))},${200 -
                        (d.value / maxValue) * 160}`
                  )
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Max" value={max} icon={TrendingUp} color="blue" />
              <DashboardCard title="Min" value={min} icon={TrendingDown} color="green" />
              <DashboardCard title="Ortalama" value={avg.toFixed(2)} icon={Activity} color="yellow" />
              <DashboardCard title="Toplam" value={points.length} icon={Hash} color="blue" />
            </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Trend görmek için etiket seçin.</div>
      )}
    </div>
  </div>
  );
};

