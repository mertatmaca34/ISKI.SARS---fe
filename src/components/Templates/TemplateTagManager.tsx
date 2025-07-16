import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { tagService, templateService, ReportTemplateTagDto } from '../../services';
import { ConfirmToast } from '../ConfirmToast';

interface TemplateTagManagerProps {
  templateId: number;
  onBack: () => void;
}

export const TemplateTagManager: React.FC<TemplateTagManagerProps> = ({ templateId, onBack }) => {
  const [tags, setTags] = useState<ReportTemplateTagDto[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNodeId, setNewNodeId] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadTags = useCallback(() => {
    tagService
      .list({ index: 0, size: 100 })
      .then(res => setTags(res.items.filter(t => t.reportTemplateId === templateId)))
      .catch(() => setTags([]));
  }, [templateId]);

  useEffect(() => {
    templateService
      .getById(templateId)
      .then(res => setTemplateName(res.name))
      .catch(() => setTemplateName(''));
    loadTags();
  }, [templateId, loadTags]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await tagService.create({ reportTemplateId: templateId, tagName: newName, tagNodeId: newNodeId });
    setNewName('');
    setNewNodeId('');
    setShowForm(false);
    loadTags();
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    await tagService.delete(deleteId);
    setDeleteId(null);
    loadTags();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Taglar - {templateName}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Yeni Tag</span>
          </button>
          <button
            onClick={onBack}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Geri
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-2 bg-white p-4 rounded-md border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etiket Adı</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Node ID</label>
            <input
              type="text"
              value={newNodeId}
              onChange={e => setNewNodeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">İptal</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiket Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Node ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.map(tag => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tag.tagName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{tag.tagNodeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => setDeleteId(tag.id)}
                      className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tags.length === 0 && (
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
