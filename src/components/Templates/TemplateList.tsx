import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, RefreshCcw } from 'lucide-react';
import {
  templateService,
  tagService,
  ReportTemplateDto,
} from '../../services';

export const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplateDto[]>([]);
  const [tags, setTags] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [, setShowCreateForm] = useState(false);

  const loadData = () => {
    templateService
      .list({ pageNumber: 0, pageSize: 50 })
      .then((res) => setTemplates(res.items))
      .catch(() => setTemplates([]));
    tagService
      .list({ pageNumber: 0, pageSize: 100 })
      .then((res) => {
        const grouped: Record<string, number> = {};
        res.items.forEach((t) => {
          grouped[t.reportTemplateId] = (grouped[t.reportTemplateId] || 0) + 1;
        });
        setTags(grouped);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = async (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;
    try {
      await templateService.update({ ...template, isActive: !template.isActive });
    } finally {
      templateService
        .list({ pageNumber: 0, pageSize: 50 })
        .then((res) => setTemplates(res.items));
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      await templateService.delete(Number(id));
      templateService
        .list({ pageNumber: 0, pageSize: 50 })
        .then((res) => setTemplates(res.items));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Rapor Şablonları</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center space-x-1 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Yenile</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Yeni Şablon</span>
          </button>
        </div>
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
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                {/* description not provided by API */}
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
                <span className="text-gray-600">Çekme Aralığı:</span>
                <span>{template.pullInterval}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Etiket Sayısı:</span>
                <span>{tags[template.id] || 0}</span>
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

            {/* metadata like creator or date not provided by API */}
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