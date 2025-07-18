import React, { useEffect, useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { UserDto } from '../../services';
import { userController } from '../../controllers/userController';
import { ConfirmToast } from '../ConfirmToast';

export const SimpleUserList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadUsers = () => {
    userController
      .list({ index: 0, size: 50 })
      .then(res => setUsers(res.items))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await userController.delete(deleteId);
    setUsers(current => current.filter(u => u.id !== deleteId));
    setDeleteId(null);
    loadUsers();
  };

  const handleEdit = (id: string) => {
    window.history.pushState({}, '', `/Users/Edit/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="space-y-6 px-2">
      <h1 className="text-2xl font-semibold text-gray-900">Kullanıcılar</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(user.id)}
                        className="p-2 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç kullanıcı bulunamadı.</p>
        </div>
      )}
      <ConfirmToast
        open={deleteId !== null}
        message="Bu kullanıcıyı silmek istediğinize emin misiniz?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
