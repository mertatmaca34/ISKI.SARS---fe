import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  tagService,
  templateService,
  archiveTagService,
  ReportTemplateTagDto,
  ArchiveTagDto,
} from '../../services';
import { ConfirmToast } from '../ConfirmToast';

interface TemplateTagManagerProps {
  templateId: number;
  onBack: () => void;
}

export const TemplateTagManager: React.FC<TemplateTagManagerProps> = ({
  templateId,
  onBack,
}) => {
  const [tags, setTags] = useState<ReportTemplateTagDto[]>([]);
  const [available, setAvailable] = useState<ArchiveTagDto[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [selected, setSelected] = useState<Record<number, ArchiveTagDto>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadTags = useCallback(() => {
    tagService
      .list({ index: 0, size: 100 })
      .then((res) =>
        setTags(res.items.filter((t) => t.reportTemplateId === templateId))
      )
      .catch(() => setTags([]));
  }, [templateId]);

  const loadAvailable = useCallback(() => {
    archiveTagService
      .list({ index: 0, size: 200 })
      .then((res) => setAvailable(res.items))
      .catch(() => setAvailable([]));
  }, []);

  useEffect(() => {
    templateService
      .getById(templateId)
      .then((res) => {
        setTemplateName(res.name);
        setCreatedBy(res.createdByUserId);
        setIsShared(res.isShared);
      })
      .catch(() => {
        setTemplateName('');
        setCreatedBy('');
        setIsShared(false);
      });
    loadTags();
    loadAvailable();
  }, [templateId, loadTags, loadAvailable]);

  const toggleSelect = (tag: ArchiveTagDto) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[tag.id]) {
        delete copy[tag.id];
      } else {
        copy[tag.id] = tag;
      }
      return copy;
    });
  };

  const saveTags = async () => {
    for (const tag of Object.values(selected)) {
      if (!tags.some((t) => t.tagNodeId === tag.tagNodeId)) {
        await tagService.create({
          reportTemplateId: templateId,
          tagName: tag.tagName,
          tagNodeId: tag.tagNodeId,
          description: tag.description,
        });
      }
    }
    setSelected({});
    loadTags();
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    await tagService.delete(deleteId);
    setDeleteId(null);
    loadTags();
  };

  return (
    <div className="space-y-6 px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Taglar - {templateName}
        </h1>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Geri
        </button>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex space-x-4">
          <span className="text-gray-600">Oluşturan: {createdBy}</span>
          <span className="text-gray-600">
            Paylaşıldı: {isShared ? 'Evet' : 'Hayır'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
            <div className="flex justify-end p-4 border-b">
              <button
                onClick={saveTags}
                disabled={Object.keys(selected).length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Kaydet
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3" />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiket Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Node ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {available.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <input
                          type="checkbox"
                          checked={!!selected[tag.id]}
                          onChange={() => toggleSelect(tag)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tag.tagName}
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
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3" />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiket Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map((tag) => (
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
                        {tag.description || '-'}
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
        </div>
      </div>

      <ConfirmToast
        open={deleteId !== null}
        message="Bu etiketi silmek istediğinize emin misiniz?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
