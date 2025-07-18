import React, { useEffect, useState } from 'react';
import { userService } from '../../services';
import { ConfirmToast } from '../ConfirmToast';
import { SimpleToast } from '../SimpleToast';

interface UserEditFormProps {
  id: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ id, onSuccess, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    userService.getById(id).then((u) => {
      setFirstName(u.firstName);
      setLastName(u.lastName);
      setEmail(u.email);
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError('');
    try {
      await userService.update({ id, email, firstName, lastName });
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
      <h1 className="text-2xl font-semibold text-gray-900">Kullanıcıyı Düzenle</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
      >
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
      <SimpleToast
        message="Kullanıcı başarıyla güncellendi."
        open={showToast}
        onClose={() => {
          setShowToast(false);
          onSuccess();
        }}
      />
      <ConfirmToast
        open={showConfirm}
        message="Bu kullanıcıyı güncellemek istediğinize emin misiniz?"
        onConfirm={confirmUpdate}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
