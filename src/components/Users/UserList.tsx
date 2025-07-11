import React, { useEffect, useState } from 'react';
import { Plus, Search, UserCheck, UserX, Edit2, RefreshCcw } from 'lucide-react';
import { User } from '../../types';
import { userService } from '../../services';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    userService
      .list({ pageNumber: 0, pageSize: 50 })
      .then((res) =>
        setUsers(
          res.items.map((u) => ({
            id: u.id.toString(),
            username: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: 'operator',
            createdAt: new Date().toISOString(),
            isActive: u.status ?? true,
          }))
        )
      )
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    loadData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveUser = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: 'operator', isActive: true } : user
    ));
  };

  const handleRejectUser = (id: string) => {
    if (window.confirm('Bu kullanıcıyı reddetmek istediğinizden emin misiniz?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'operator':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'operator':
        return 'Operatör';
      case 'pending':
        return 'Onay Bekliyor';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kullanıcı Yönetimi</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center space-x-1 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Yenile</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Yeni Kullanıcı</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {user.role === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectUser(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç kullanıcı bulunamadı.</p>
        </div>
      )}
    </div>
  );
};