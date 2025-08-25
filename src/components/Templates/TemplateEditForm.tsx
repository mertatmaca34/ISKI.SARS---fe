import React, { useEffect, useState } from 'react';
import { templateService, userService, UserDto } from '../../services';
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
  const [users, setUsers] = useState<UserDto[]>([]);
  const [shared, setShared] = useState<Record<string, UserDto>>({});

  useEffect(() => {
    const currentUser = authStore.getCurrentUser();
    if (!currentUser) return;
    Promise.all([
      templateService.getById(id, currentUser.id),
      userService.list({ index: 0, size: 200 }),
    ])
      .then(([template, usersRes]) => {
        setName(template.name);
        setUsers(usersRes.items);
        const selected: Record<string, UserDto> = {};
        template.sharedUserIds.forEach((userId) => {
          const user = usersRes.items.find((u) => u.id === userId);
          if (user) selected[userId] = user;
        });
        setShared(selected);
      })
      .catch(() => {
        setUsers([]);
      });
  }, [id]);

  const toggleUser = (user: UserDto) => {
    setShared((prev) => {
      const copy = { ...prev };
      if (copy[user.id]) {
        delete copy[user.id];
      } else {
        copy[user.id] = user;
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await templateService.update({ id, name, sharedUserIds: Object.keys(shared) });
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paylaşılan Kullanıcılar</label>
          <div className="max-h-40 overflow-auto border border-gray-200 rounded">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2" />
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={!!shared[user.id]}
                        onChange={() => toggleUser(user)}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
