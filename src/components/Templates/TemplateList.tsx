import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCcw } from 'lucide-react';
import {
  templateService,
  tagService,
  ReportTemplateDto,
  userService,
  UserDto,
} from '../../services';
import { templateController } from '../../controllers/templateController';
import { ConfirmToast } from '../ConfirmToast';
import { TemplateCreateForm } from './TemplateCreateForm';
import { authStore } from '../../store/authStore';

export const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplateDto[]>([]);
  const [tags, setTags] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<Record<string, UserDto>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const currentUser = authStore.getCurrentUser();

  const loadData = () => {
    const currentUser = authStore.getCurrentUser();
    if (!currentUser) {
      setTemplates([]);
      return;
    }
    templateService
      .list({ index: 0, size: 50 }, currentUser.id)
      .then((res) => setTemplates(res.items))
      .catch(() => setTemplates([]));
    tagService
      .list({ index: 0, size: 100 })
      .then((res) => {
        const grouped: Record<string, number> = {};
        res.items.forEach((t) => {
          grouped[t.reportTemplateId] = (grouped[t.reportTemplateId] || 0) + 1;
        });
        setTags(grouped);
      });

    userService
      .list({ index: 0, size: 200 })
      .then((res) => {
        const map: Record<string, UserDto> = {};
        res.items.forEach((u) => {
          map[u.id] = u;
        });
        setUsers(map);
      })
      .catch(() => setUsers({}));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    loadData();
  };

  const handleDelete = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (template && template.createdByUserId !== currentUser?.id) return;
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    await templateController.delete(deleteId);
    setTemplates((current) => current.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  const handleEdit = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (template && template.createdByUserId !== currentUser?.id) return;
    window.history.pushState({}, '', `/Templates/Edit/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleManageTags = (id: number) => {
    window.history.pushState({}, '', `/Templates/${id}/Tags`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleManageShare = (id: number) => {
    window.history.pushState({}, '', `/Templates/${id}/Share`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (showCreateForm) {
    return (
      <TemplateCreateForm
        onSuccess={() => {
          setShowCreateForm(false);
          loadData();
        }}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6 px-2">
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
              {template.createdByUserId === currentUser?.id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(template.id)}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Etiket Sayısı:</span>
                <span>{tags[template.id] || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturan:</span>
                <span
                  className="text-gray-900 truncate max-w-[8rem]"
                  title={
                    users[template.createdByUserId]
                      ? `${users[template.createdByUserId].firstName} ${users[template.createdByUserId].lastName}`
                      : template.createdByUserId
                  }
                >
                  {users[template.createdByUserId]
                    ? `${users[template.createdByUserId].firstName} ${users[template.createdByUserId].lastName}`
                    : template.createdByUserId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paylaşıldı:</span>
                <button
                  onClick={() => handleManageShare(template.id)}
                  className="px-2 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Yönet
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taglar:</span>
                <button
                  onClick={() => handleManageTags(template.id)}
                  className="px-2 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Yönet
                </button>
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
      <ConfirmToast
        open={deleteId !== null}
        message="Bu şablonu silmek istediğinize emin misiniz?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};