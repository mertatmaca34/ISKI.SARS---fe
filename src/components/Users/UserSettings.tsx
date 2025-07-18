import React, { useEffect, useState } from 'react';
import { userService, UserDto } from '../../services';
import { authStore } from '../../store/authStore';
import { Toast } from '../Toast';

export const UserSettings: React.FC = () => {
  const currentUser = authStore.getCurrentUser();
  const [user, setUser] = useState<UserDto | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const infoChanged =
    firstName !== (user?.firstName || '') ||
    lastName !== (user?.lastName || '') ||
    email !== (user?.email || '');
  const passwordsMatch = newPassword === confirmPassword;
  const canUpdateInfo = infoChanged && !savingInfo;
  const canChangePassword =
    !!oldPassword &&
    !!newPassword &&
    !!confirmPassword &&
    passwordsMatch &&
    !savingPassword;

  useEffect(() => {
    if (!currentUser) return;
    userService
      .getById(currentUser.id)
      .then((u) => {
        setUser(u);
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setEmail(u.email);
      })
      .catch(() => setUser(null));
  }, [currentUser]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword !== confirmPassword) {
      setPasswordError('Yeni şifreler uyuşmuyor');
      return;
    }
    setPasswordError('');
    setSavingPassword(true);
    try {
      await userService.changePassword({
        userId: currentUser.id,
        oldPassword,
        newPassword,
      });
      setToastMessage('Şifre başarıyla güncellendi');
      setShowToast(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSavingInfo(true);
    try {
      await userService.update({
        id: currentUser.id,
        email,
        firstName,
        lastName,
      });
      setUser({ id: currentUser.id, email, firstName, lastName });
      setToastMessage('Bilgiler güncellendi');
      setShowToast(true);
    } catch {
      // ignore error for now
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <div className="space-y-6 px-2">
      <Toast
        open={showToast}
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
      />
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <form className="space-y-4" onSubmit={handleUpdateInfo}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!canUpdateInfo}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Güncelle
          </button>
        </form>

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
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={!canChangePassword}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Şifreyi Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};
