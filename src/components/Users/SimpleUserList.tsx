import React, { useEffect, useState } from 'react';
import { userService, UserDto } from '../../services';

export const SimpleUserList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);

  useEffect(() => {
    userService
      .list({ index: 0, size: 50 })
      .then(res => setUsers(res.items))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Kullanıcılar</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> 
                      {user.status ? 'Aktif' : 'Pasif'}
                    </span>
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
    </div>
  );
};
