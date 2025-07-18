import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import {
  tagService,
  templateService,
  ReportTemplateTagDto,
  ReportTemplateDto,
} from '../../services';
import { ConfirmToast } from '../ConfirmToast';

export const TagList: React.FC = () => {
  const [tags, setTags] = useState<ReportTemplateTagDto[]>([]);
  const [templates, setTemplates] = useState<ReportTemplateDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    tagService
      .list({ index: 0, size: 100 })
      .then((res) => setTags(res.items));
    templateService
      .list({ index: 0, size: 50 })
      .then((res) => setTemplates(res.items));
  }, []);

  const filteredTags = tags.filter((tag) => {
    const matchesSearch = tag.tagName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTemplate =
      selectedTemplate === 'all' || tag.reportTemplateId === Number(selectedTemplate);
    return matchesSearch && matchesTemplate;
  });

  const getTemplateName = (templateId: number) => {
    const template = templates.find((t) => t.id === templateId);
    return template?.name || 'Bilinmiyor';
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    await tagService.delete(deleteId);
    setTags((current) => current.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };


  return (
    <div className="space-y-6 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Etiketler</h1>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Etiket ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Şablonlar</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-auto h-[calc(100vh-16rem)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3" />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiket Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şablon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Node ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setDeleteId(tag.id)}
                      className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tag.tagName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTemplateName(tag.reportTemplateId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {tag.tagNodeId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Hiç etiket bulunamadı.</p>
        </div>
      )}
      <ConfirmToast
        open={deleteId !== null}
        message="Bu etiketi silmek istediğinize emin misiniz?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
