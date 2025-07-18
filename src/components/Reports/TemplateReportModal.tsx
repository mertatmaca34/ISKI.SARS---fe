import React, { useEffect, useState } from 'react';
import {
  tagService,
  instantValueService,
  ReportTemplateTagDto,
} from '../../services';
import { SimpleToast } from '../SimpleToast';

interface TemplateReportModalProps {
  templateId: number;
  templateName: string;
  onClose: () => void;
}

type TagData = { timestamp: string; value: number | string };
type ReportData = Record<string, TagData[]>;

export const TemplateReportModal: React.FC<TemplateReportModalProps> = ({
  templateId,
  templateName,
  onClose,
}) => {
  const [tags, setTags] = useState<ReportTemplateTagDto[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'excel'>('pdf');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    tagService
      .list({ index: 0, size: 100 })
      .then((res) =>
        setTags(res.items.filter((t) => t.reportTemplateId === templateId))
      )
      .catch(() => setTags([]));
  }, [templateId]);

  const fetchData = async (): Promise<ReportData> => {
    const result: ReportData = {};
    for (const tag of tags) {
      try {
        const res = await instantValueService.list(
          { index: 0, size: 1000 },
          {
            filters: [
              { field: 'reportTemplateTagId', operator: 'eq', value: String(tag.id) },
              { field: 'timestamp', operator: 'between', value: `${startDate},${endDate}` },
            ],
            sorts: [{ field: 'timestamp', direction: 'ASC' }],
          }
        );
        result[tag.tagName] = res.items.map((v) => ({
          timestamp: v.timestamp,
          value: v.value,
        }));
      } catch {
        result[tag.tagName] = [];
      }
    }
    return result;
  };

  const generateCsv = (data: ReportData) => {
    let csv = 'Tag,Timestamp,Value\n';
    Object.keys(data).forEach((tag) => {
      data[tag].forEach((d) => {
        csv += `${tag},${d.timestamp},${d.value}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePdf = (data: ReportData) => {
    let html = `<html><head><title>${templateName} Raporu</title>`;
    html += '<style>body{font-family:sans-serif;padding:20px;}h2{margin-top:24px;}svg{background:#fff;border:1px solid #ddd;}</style>';
    html += '</head><body>';
    html += `<h1>${templateName} Raporu</h1>`;
    Object.keys(data).forEach((tag) => {
      const d = data[tag];
      html += `<h2>${tag}</h2>`;
      html += '<svg width="600" height="200">';
      if (d.length > 0) {
        const maxVal = Math.max(...d.map((v) => Number(v.value)));
        const minVal = Math.min(...d.map((v) => Number(v.value)));
        const start = new Date(d[0].timestamp).getTime();
        const end = new Date(d[d.length - 1].timestamp).getTime();
        const points = d
          .map((v) => {
            const x = ((new Date(v.timestamp).getTime() - start) / (end - start || 1)) * 580 + 10;
            const y = 190 - ((Number(v.value) - minVal) / (maxVal - minVal || 1)) * 180;
            return `${x},${y}`;
          })
          .join(' ');
        html += `<polyline fill="none" stroke="black" stroke-width="1" points="${points}"/>`;
        d.forEach((v) => {
          const x = ((new Date(v.timestamp).getTime() - start) / (end - start || 1)) * 580 + 10;
          const y = 190 - ((Number(v.value) - minVal) / (maxVal - minVal || 1)) * 180;
          html += `<circle cx="${x}" cy="${y}" r="2" fill="blue"/>`;
        });
      }
      html += '</svg>';
    });
    html += '</body></html>';
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.addEventListener('load', () => win.print());
    }
  };

  const handleGenerate = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const data = await fetchData();
    setLoading(false);
    if (fileType === 'excel') {
      generateCsv(data);
    } else {
      generatePdf(data);
    }
    setShowToast(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 space-y-4">
        <h2 className="text-lg font-semibold">{templateName} - Rapor Oluştur</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosya Türü</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as 'pdf' | 'excel')}
            className="w-full border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            İptal
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Oluştur
          </button>
        </div>
      </div>
      <SimpleToast
        message="Rapor oluşturuldu."
        open={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

