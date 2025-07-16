import React, { useEffect, useState } from 'react';
import { userService, UserDto } from '../../services';
import { authStore } from '../../store/authStore';
import { SimpleToast } from '../SimpleToast';

export const UserSettings: React.FC = () => {
  const currentUser = authStore.getCurrentUser();
  const [user, setUser] = useState<UserDto | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    userService
      .getById(currentUser.id)
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, [currentUser]);

  useEffect(() => {
    setMessage('');
  }, [oldPassword, newPassword, confirmPassword]);

  const isPasswordValid =
    oldPassword !== '' &&
    newPassword !== '' &&
    confirmPassword !== '' &&
    newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword !== confirmPassword) {
      setMessage('Yeni şifreler uyuşmuyor');
      return;
    }
    setIsLoading(true);
    try {
      await userService.changePassword({
        userId: currentUser.id,
        oldPassword,
        newPassword,
      });
      setShowToast(true);
      setMessage('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Kullanıcı Ayarları</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-2">
        {user ? (
          <>
            <div>
              <span className="font-medium">Ad:</span> {user.firstName}
            </div>
            <div>
              <span className="font-medium">Soyad:</span> {user.lastName}
            </div>
            <div>
              <span className="font-medium">E-posta:</span> {user.email}
            </div>
          </>
        ) : (
          <p>Kullanıcı bilgileri yüklenemedi.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form className="space-y-4" onSubmit={handleChangePassword}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eski Şifre
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre (Onay)
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {message && <p className="text-sm text-red-600">{message}</p>}
          <button
            type="submit"
            disabled={!isPasswordValid || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>
      <SimpleToast
        message="Şifre başarıyla güncellendi"
        open={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
