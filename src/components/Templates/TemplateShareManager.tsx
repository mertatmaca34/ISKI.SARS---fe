import React, { useEffect, useState } from 'react';
import { templateService, userService, UserDto } from '../../services';
import { authStore } from '../../store/authStore';
import { SimpleToast } from '../SimpleToast';

interface TemplateShareManagerProps {
  templateId: number;
  onBack: () => void;
}

export const TemplateShareManager: React.FC<TemplateShareManagerProps> = ({
  templateId,
  onBack,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const currentUser = authStore.getCurrentUser();
    if (!currentUser) return;
    templateService
      .getById(templateId, currentUser.id)
      .then((res) => {
        setTemplateName(res.name);
        userService
          .getById(res.createdByUserId)
          .then((u) => setCreatedBy(`${u.firstName} ${u.lastName}`))
          .catch(() => setCreatedBy(res.createdByUserId));
        const sharedIds = (res as { sharedUserIds?: string[] }).sharedUserIds || [];
        const map: Record<string, boolean> = {};
        sharedIds.forEach((id: string) => {
          map[id] = true;
        });
        setSelected(map);
      })
      .catch(() => {
        setTemplateName('');
        setCreatedBy('');
        setSelected({});
      });

    userService
      .list({ index: 0, size: 200 })
      .then((res) => setUsers(res.items))
      .catch(() => setUsers([]));
  }, [templateId]);

  const toggleUser = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveShares = async () => {
    setIsSaving(true);
    try {
      await templateService.update({
        id: templateId,
        name: templateName,
        sharedUserIds: Object.keys(selected).filter((id) => selected[id]),
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onBack();
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Paylaşılan Kullanıcılar - {templateName}
        </h1>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Geri
        </button>
      </div>
      <div className="space-y-1 text-sm">
        <span className="text-gray-600">Oluşturan: {createdBy}</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={saveShares}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Kaydet
          </button>
        </div>
        <div className="max-h-[calc(100vh-16rem)] overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3" />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="checkbox"
                      checked={!!selected[user.id]}
                      onChange={() => toggleUser(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SimpleToast
        message="Paylaşımlar başarıyla kaydedildi."
        open={showToast}
        onClose={() => {
          setShowToast(false);
          onBack();
        }}
      />
    </div>
  );
};

