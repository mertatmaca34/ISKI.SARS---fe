import React, { useState, useEffect } from 'react';
import { Save, Database, Globe, Bell, Shield } from 'lucide-react';
import { SystemSettings } from '../../types';
import { systemSettingsService } from '../../services';
import { SimpleToast } from '../SimpleToast';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    opcServerUrl: '',
    databaseConnection: '',
    retentionDays: 0,
    emailNotifications: true,
    smsNotifications: true,
    alertThreshold: 0,
    sessionTimeout: 0,
    logLevel: 0,
    backupEnabled: true,
    backupIntervalHours: 0,
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    systemSettingsService
      .get()
      .then((data) => setSettings(data))
      .catch(() => {
        /* handle error */
      });
  }, []);

  const handleSave = () => {
    systemSettingsService
      .save(settings)
      .then(() => setShowToast(true))
      .catch(() => {
        /* handle error */
      });
  };

  return (
    <>
      <div className="space-y-6 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sistem Ayarları</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>Kaydet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Veritabanı Ayarları</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OPC Sunucusu URL'si
              </label>
              <input
                type="text"
                value={settings.opcServerUrl}
                onChange={(e) => setSettings({...settings, opcServerUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veritabanı Bağlantısı
              </label>
              <input
                type="text"
                value={settings.databaseConnection}
                onChange={(e) => setSettings({...settings, databaseConnection: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veri Saklama Süresi (Gün)
              </label>
              <input
                type="number"
                value={settings.retentionDays}
                onChange={(e) => setSettings({...settings, retentionDays: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bildirim Ayarları</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                E-posta Bildirimleri
              </label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                SMS Bildirimleri
              </label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uyarı Eşiği (%)
              </label>
              <input
                type="number"
                value={settings.alertThreshold}
                onChange={(e) => setSettings({...settings, alertThreshold: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Güvenlik Ayarları</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oturum Zaman Aşımı (Dakika)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Seviyesi
              </label>
              <select
                value={settings.logLevel}
                onChange={(e) => setSettings({...settings, logLevel: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Hata</option>
                <option value={1}>Uyarı</option>
                <option value={2}>Bilgi</option>
                <option value={3}>Hata Ayıklama</option>
              </select>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Yedekleme Ayarları</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Otomatik Yedekleme
              </label>
              <input
                type="checkbox"
                checked={settings.backupEnabled}
                onChange={(e) => setSettings({...settings, backupEnabled: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yedekleme Aralığı (Saat)
              </label>
              <input
                type="number"
                value={settings.backupIntervalHours}
                onChange={(e) => setSettings({...settings, backupIntervalHours: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!settings.backupEnabled}
              />
            </div>
          </div>
        </div>
      </div>
     </div>
      <SimpleToast
        message="Ayarlar başarıyla kaydedildi."
        open={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};