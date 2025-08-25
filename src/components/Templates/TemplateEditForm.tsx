import React, { useEffect, useState } from 'react';
import { templateService } from '../../services';
import { SimpleToast } from '../SimpleToast';
import { authStore } from '../../store/authStore';

interface TemplateEditFormProps {
  id: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TemplateEditForm: React.FC<TemplateEditFormProps> = ({ id, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const currentUser = authStore.getCurrentUser();
    if (!currentUser) return;
    templateService.getById(id, currentUser.id).then((res) => {
      if (res.createdByUserId !== currentUser.id) {
        setHasPermission(false);
      } else {
        setName(res.name);
        setHasPermission(true);
      }
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await templateService.update({ id, name, sharedUserIds: [] });
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

  if (hasPermission === false) {
    return (
      <div className="space-y-6 px-2">
        <h1 className="text-2xl font-semibold text-gray-900">Şablonu Düzenle</h1>
        <p className="text-sm text-red-600">Bu şablonu düzenleme yetkiniz yok.</p>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return null;
  }

  return (
    <div className="space-y-6 px-2">
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
