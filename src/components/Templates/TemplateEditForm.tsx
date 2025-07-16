import React, { useEffect, useState } from 'react';
import { templateService } from '../../services';
import { SimpleToast } from '../SimpleToast';

interface TemplateEditFormProps {
  id: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TemplateEditForm: React.FC<TemplateEditFormProps> = ({ id, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [opcEndpoint, setOpcEndpoint] = useState('');
  const [pullInterval, setPullInterval] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    templateService.getById(id).then((res) => {
      setName(res.name);
      setOpcEndpoint(res.opcEndpoint);
      setPullInterval(res.pullInterval);
      setIsActive(!!res.isActive);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await templateService.update({ id, name, opcEndpoint, pullInterval, isActive });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onSuccess();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Şablonu Düzenle</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OPC Endpoint</label>
          <input
            type="text"
            value={opcEndpoint}
            onChange={(e) => setOpcEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Çekme Aralığı (s)</label>
          <input
            type="number"
            value={pullInterval}
            onChange={(e) => setPullInterval(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktif</label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
      <SimpleToast message="Şablon başarıyla güncellendi." open={showToast} onClose={() => { setShowToast(false); onSuccess(); }} />
    </div>
  );
};
