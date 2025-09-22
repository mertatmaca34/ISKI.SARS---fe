import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  archiveTagService,
  ArchiveTagDto,
  trendService,
  TrendPoint,
} from '../../services';
import { Activity, Clock, Hash, TrendingDown, TrendingUp, X } from 'lucide-react';
import { DashboardCard } from '../Dashboard/DashboardCard';

const LINE_COLORS = ['#3b82f6', '#ef4444'];

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
  const [tagPoints, setTagPoints] = useState<Record<number, TrendPoint[]>>({});
  const [realtime, setRealtime] = useState(false);

  useEffect(() => {
    archiveTagService
      .list({ index: 0, size: 100 })
      .then((res) => setTags(res.items))
      .catch(() => setTags([]));
  }, []);

  const activeTag = tags.find((t) => t.id === activeId) || null;

  useEffect(() => {
    if (selectedIds.length === 0) {
      setActiveId(null);
      return;
    }

    if (!activeId || !selectedIds.includes(activeId)) {
      setActiveId(selectedIds[0]);
    }
  }, [activeId, selectedIds]);

  const loadData = useCallback(async () => {
    if (!selectedIds.length) {
      setTagPoints({});
      return;
    }

    const responses = await Promise.all(
      selectedIds.map(async (id) => {
        const tag = tags.find((t) => t.id === id);
        if (!tag) {
          return { id, points: [] as TrendPoint[] };
        }

        try {
          const res = await trendService.get(tag, start + ':00Z', end + ':00Z');
          return { id, points: res.points ?? [] };
        } catch (error) {
          return { id, points: [] as TrendPoint[] };
        }
      })
    );

    setTagPoints((prev) => {
      const next: Record<number, TrendPoint[]> = {};
      responses.forEach(({ id, points }) => {
        next[id] = points;
      });
      return next;
    });
  }, [selectedIds, tags, start, end]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!realtime || !selectedIds.length) return;
    const interval = setInterval(() => {
      const now = new Date();
      const s = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      setStart(s.toISOString().slice(0, 16));
      setEnd(now.toISOString().slice(0, 16));
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [realtime, selectedIds, loadData]);

  const handleAddTag = () => {
    if (tagToAdd === '') return;
    const id = Number(tagToAdd);
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 2) return;
    setSelectedIds([...selectedIds, id]);
    setActiveId(id);
    setTagToAdd('');
  };

  const selectedTags = useMemo(
    () =>
      selectedIds
        .map((id) => tags.find((t) => t.id === id) || null)
        .filter((t): t is ArchiveTagDto => t !== null),
    [selectedIds, tags]
  );

  const handleRemoveTag = (id: number) => {
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    setTagPoints((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveId((prev) => (prev === id ? null : prev));
  };

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

  const activePoints = activeId ? tagPoints[activeId] ?? [] : [];
  const allPoints = useMemo(
    () => selectedIds.flatMap((id) => tagPoints[id] ?? []),
    [selectedIds, tagPoints]
  );
  const max = activePoints.length ? Math.max(...activePoints.map((p) => p.value)) : 0;
  const min = activePoints.length ? Math.min(...activePoints.map((p) => p.value)) : 0;
  const avg = activePoints.length
    ? activePoints.reduce((s, p) => s + p.value, 0) / activePoints.length
    : 0;
  const maxValue = Math.max(...allPoints.map((d) => d.value), 1);

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
            disabled={tagToAdd === '' || selectedIds.length >= 2}
            className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50"
          >
            Ekle
          </button>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((t, idx) => {
              const isActive = activeId === t.id;
              const color = LINE_COLORS[idx % LINE_COLORS.length];
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-2 rounded border px-3 py-1 ${
                    isActive
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{t.tagName}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t.id)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={`${t.tagName} etiketini kaldır`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      {selectedTags.length > 0 ? (
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
              {selectedIds.map((id, idx) => {
                const seriesPoints = tagPoints[id] ?? [];
                if (!seriesPoints.length) return null;
                const color = LINE_COLORS[idx % LINE_COLORS.length];
                const step = 400 / Math.max(seriesPoints.length - 1, 1);
                return (
                  <React.Fragment key={id}>
                    <polyline
                      points={seriesPoints
                        .map(
                          (d, i) =>
                            `${i * step},${200 - (d.value / maxValue) * 160}`
                        )
                        .join(' ')}
                      fill="none"
                      stroke={color}
                      strokeWidth={activeId === id ? 3 : 2}
                      strokeOpacity={
                        activeId && activeId !== id ? 0.6 : 1
                      }
                    />
                    {seriesPoints.map((d, i) => (
                      <circle
                        key={`${id}-${d.timestamp}-${i}`}
                        cx={i * step}
                        cy={200 - (d.value / maxValue) * 160}
                        r={activeId === id ? 4 : 3}
                        fill={color}
                        fillOpacity={activeId && activeId !== id ? 0.7 : 1}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
              {activePoints.map((d) => (
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
              <DashboardCard title="Toplam" value={activePoints.length} icon={Hash} color="blue" />
            </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Trend görmek için etiket seçin.</div>
      )}
    </div>
  </div>
  );
};

