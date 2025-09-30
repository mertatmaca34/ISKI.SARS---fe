import React, { useState, useEffect } from 'react';
import {
  templateService,
  archiveTagService,
  reportTemplateArchiveTagService,
  ArchiveTagDto,
  userService,
  UserDto,
} from '../../services';
import { authStore } from '../../store/authStore';

interface TemplateCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TemplateCreateForm: React.FC<TemplateCreateFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [available, setAvailable] = useState<ArchiveTagDto[]>([]);
  const [selected, setSelected] = useState<Record<number, ArchiveTagDto>>({});
  const [users, setUsers] = useState<UserDto[]>([]);
  const [shared, setShared] = useState<Record<string, UserDto>>({});

  useEffect(() => {
    archiveTagService
      .list({ index: 0, size: 200 })
      .then((res) => setAvailable(res.items))
      .catch(() => setAvailable([]));

    userService
      .list({ index: 0, size: 200 })
      .then((res) => setUsers(res.items))
      .catch(() => setUsers([]));
  }, []);

  const toggleSelect = (tag: ArchiveTagDto) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[tag.id]) {
        delete copy[tag.id];
      } else {
        copy[tag.id] = tag;
      }
      return copy;
    });
  };

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
      const currentUser = authStore.getCurrentUser();
      if (!currentUser) throw new Error('Kullanıcı oturum açmamış');
      const template = await templateService.create({
        name,
        createdByUserId: currentUser.id,
        sharedUserIds: Object.keys(shared),
      });
      for (const tag of Object.values(selected)) {
        await reportTemplateArchiveTagService.create({
          reportTemplateId: template.id,
          archiveTagId: tag.id,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-2">
      <h1 className="text-2xl font-semibold text-gray-900">Yeni Şablon Oluştur</h1>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Taglar</label>
          <div className="max-h-60 overflow-auto border border-gray-200 rounded">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2" />
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etiket Adı
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Node ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {available.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={!!selected[tag.id]}
                        onChange={() => toggleSelect(tag)}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{tag.tagName}</td>
                    <td className="px-4 py-2 text-sm font-mono text-gray-600">{tag.tagNodeId}</td>
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
    </div>
  );
};
