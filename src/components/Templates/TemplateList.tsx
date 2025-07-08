import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Power, Search } from 'lucide-react';
import { ReportTemplate } from '../../types';
import { dataStore } from '../../store/dataStore';

export const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>(dataStore.getTemplates());
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      dataStore.updateTemplate(id, { isActive: !template.isActive });
      setTemplates(dataStore.getTemplates());
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      dataStore.deleteTemplate(id);
      setTemplates(dataStore.getTemplates());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Rapor Şablonları</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Yeni Şablon</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Şablon ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(template.id)}
                  className={`p-2 rounded-md ${
                    template.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-md text-gray-600 hover:bg-gray-50">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">OPC Endpoint:</span>
                <span className="font-mono text-xs">{template.opcEndpoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplama Aralığı:</span>
                <span>{template.collectionInterval}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Etiket Sayısı:</span>
                <span>{dataStore.getTagsByTemplateId(template.id).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  template.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Oluşturan: {template.createdBy}</span>
                <span>{new Date(template.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç şablon bulunamadı.</p>
        </div>
      )}
    </div>
  );
};