import React, { useState } from 'react';
import { reportService, ReportTemplateDto } from '../../services';
import { SimpleToast } from '../SimpleToast';

interface ReportModalProps {
  template: ReportTemplateDto;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ template, onClose }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [message, setMessage] = useState('');
  const [openToast, setOpenToast] = useState(false);

  const generate = async () => {
    try {
      const blob = await reportService.generate(template.id, start, end, format);
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}-${start}-${end}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage('Rapor indirildi.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Rapor oluşturulamadı');
    } finally {
      setOpenToast(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg space-y-4 w-80">
        <h2 className="text-lg font-semibold">{template.name} Raporu</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm mb-1">Başlangıç</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bitiş</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1"
            />
          </div>
          <div className="flex items-center space-x-4 pt-1">
            <label className="inline-flex items-center space-x-1">
              <input
                type="radio"
                checked={format === 'pdf'}
                onChange={() => setFormat('pdf')}
              />
              <span>PDF</span>
            </label>
            <label className="inline-flex items-center space-x-1">
              <input
                type="radio"
                checked={format === 'excel'}
                onChange={() => setFormat('excel')}
              />
              <span>Excel</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="bg-gray-200 px-3 py-1 rounded-md">İptal</button>
          <button onClick={generate} className="bg-blue-600 text-white px-3 py-1 rounded-md">Oluştur</button>
        </div>
      </div>
      <SimpleToast message={message} open={openToast} onClose={() => setOpenToast(false)} />
    </div>
  );
};
