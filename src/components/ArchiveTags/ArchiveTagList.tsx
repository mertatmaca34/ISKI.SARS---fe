import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Loader2, Pencil } from 'lucide-react';
import {
  archiveTagService,
  ArchiveTagDto,
  opcService,
  TreeNode,
} from '../../services';
import { ConfirmToast } from '../ConfirmToast';
import { Toast } from '../Toast';
import { authStore } from '../../store/authStore';
import { TrendModal } from '../Trend/TrendModal';
import { intervalOptions, formatInterval } from '../../constants/intervalOptions';

export const ArchiveTagList: React.FC = () => {
  const [tags, setTags] = useState<ArchiveTagDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [selected, setSelected] = useState<
    Record<string, { node: TreeNode; description: string }>
  >({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [trendTag, setTrendTag] = useState<ArchiveTagDto | null>(null);
  const [editTag, setEditTag] = useState<ArchiveTagDto | null>(null);
  const [isTreeLoading, setIsTreeLoading] = useState(false);
  const [showIntervalSelect, setShowIntervalSelect] = useState(false);
  const [interval, setInterval] = useState(intervalOptions[0].value);
  const [toast, setToast] = useState<
    { message: string; type: 'success' | 'error' | 'info' } | null
  >(null);
  const isAdmin = authStore.getCurrentUser()?.role === 'admin';

  const loadTags = () =>
    archiveTagService
      .list({ index: 0, size: 100 })
      .then((res) => setTags(res.items))
      .catch(() => setTags([]));

  useEffect(() => {
    loadTags();
  }, []);

  const fetchTree = async () => {
    setIsTreeLoading(true);
    try {
      const res = await opcService.tree('');
      setTree(res.data);
      setExpanded({ [res.data.nodeId]: true });
    } catch {
      setTree(null);
    } finally {
      setIsTreeLoading(false);
    }
  };

  const toggleNode = (node: TreeNode) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[node.nodeId]) {
        delete copy[node.nodeId];
      } else {
        copy[node.nodeId] = { node, description: '' };
      }
      return copy;
    });
  };

  const handleDescriptionChange = (nodeId: string, value: string) => {
    setSelected((prev) => {
      if (!prev[nodeId]) return prev;
      return {
        ...prev,
        [nodeId]: {
          ...prev[nodeId],
          description: value,
        },
      };
    });
  };

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderTree = (node: TreeNode) => {
    const isLeaf = node.nodeClass === 'Variable';
    const isOpen = expanded[node.nodeId];

    return (
      <li key={node.nodeId} className="mb-1">
        <div className="flex items-center space-x-1">
          {isLeaf ? (
            <input
              type="checkbox"
              checked={!!selected[node.nodeId]}
              onChange={() => toggleNode(node)}
            />
          ) : (
            <span
              className="cursor-pointer select-none"
              onClick={() => toggleExpand(node.nodeId)}
            >
              {isOpen ? '-' : '+'}
            </span>
          )}
          {isLeaf ? (
            <span
              className="cursor-pointer"
              onClick={() => toggleNode(node)}
            >
              {node.displayName}
            </span>
          ) : (
            <span
              className="font-semibold cursor-pointer"
              onClick={() => toggleExpand(node.nodeId)}
            >
              {node.displayName}
            </span>
          )}
        </div>
        {isOpen && node.children && node.children.length > 0 && (
          <ul className="pl-4 border-l ml-2">
            {node.children.map((child) => renderTree(child))}
          </ul>
        )}
      </li>
    );
  };

  const selectedValues = Object.values(selected);
  const hasEmptyDescription = selectedValues.some(
    ({ description }) => description.trim() === ''
  );

  const saveSelected = async (
    chosenInterval: number
  ): Promise<'success' | 'skipped' | 'error'> => {
    const nodes = Object.values(selected);
    const existingNodeIds = new Set(tags.map((tag) => tag.tagNodeId));
    const duplicates = nodes.filter(({ node }) => existingNodeIds.has(node.nodeId));
    const nodesToCreate = nodes.filter(
      ({ node }) => !existingNodeIds.has(node.nodeId)
    );

    if (duplicates.length > 0) {
      setSelected((prev) => {
        const copy = { ...prev };
        duplicates.forEach(({ node }) => {
          delete copy[node.nodeId];
        });
        return copy;
      });
    }

    if (nodesToCreate.length === 0) {
      if (duplicates.length > 0) {
        setToast({
          message:
            duplicates.length === 1
              ? 'Seçtiğiniz etiket zaten arşivde mevcut.'
              : 'Seçtiğiniz etiketler zaten arşivde mevcut.',
          type: 'info',
        });
      }
      return 'skipped';
    }

    try {
      await Promise.all(
        nodesToCreate.map(({ node, description }) =>
          archiveTagService.create({
            tagName: node.displayName,
            tagNodeId: node.nodeId,
            description: description.trim(),
            pullInterval: chosenInterval,
            isActive: true,
          })
        )
      );
      setSelected({});
      setShowAdd(false);
      loadTags();

      const createdCount = nodesToCreate.length;
      const skippedCount = duplicates.length;
      const successMessage =
        skippedCount > 0
          ? `${createdCount} etiket eklendi. ${skippedCount} etiket zaten arşivdeydi.`
          : createdCount === 1
          ? 'Etiket başarıyla arşivlendi.'
          : 'Etiketler başarıyla arşivlendi.';

      setToast({ message: successMessage, type: 'success' });
      return 'success';
    } catch (error) {
      console.error('Arşivleme başarısız oldu', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Arşivleme başarısız oldu';
      setToast({ message, type: 'error' });
      return 'error';
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (deleteId === null) return;
    await archiveTagService.delete(deleteId);
    setDeleteId(null);
    loadTags();
  };

  const saveEdit = async () => {
    if (!editTag) return;
    await archiveTagService.update(editTag);
    setEditTag(null);
    loadTags();
  };

  return (
    <div className="space-y-6 px-2">
      <Toast
        open={toast !== null}
        message={toast?.message ?? ''}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Arşivlenecek Taglar
        </h1>
        {isAdmin && (
          <button
            onClick={() => {
              setShowAdd(true);
              fetchTree();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Yeni Tag</span>
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Etiket ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-auto h-[calc(100vh-12rem)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiket Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Çekim Aralığı
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setTrendTag(tag)}
                >
                  {isAdmin && (
                    <td className="px-2 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTag({ ...tag });
                          }}
                          className="p-2 rounded-md text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(tag.id);
                          }}
                          className="p-2 rounded-md text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tag.tagName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tag.description || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatInterval(tag.pullInterval)}
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

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Yeni Tag</h2>
              <button
                onClick={() => {
                  setShowAdd(false);
                  setSelected({});
                }}
                className="text-gray-500"
              >
                X
              </button>
            </div>
            <div className="flex justify-end items-center p-4 border-b space-x-2">
              <button
                onClick={fetchTree}
                disabled={isTreeLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isTreeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Tagları Getir'
                )}
              </button>
              <button
                onClick={() => setShowIntervalSelect(true)}
                disabled={selectedValues.length === 0 || hasEmptyDescription}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Kaydet
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {isTreeLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : tree ? (
                <ul className="text-sm">{renderTree(tree)}</ul>
              ) : (
                <p className="text-center text-sm text-gray-500">Veri yok</p>
              )}
            </div>
            {selectedValues.length > 0 && (
              <div className="border-t p-4 space-y-3 max-h-60 overflow-auto">
                {hasEmptyDescription && (
                  <p className="text-sm text-red-600">
                    Lütfen tüm seçilen etiketler için açıklama giriniz.
                  </p>
                )}
                <h3 className="text-sm font-semibold text-gray-700">
                  Seçilen Etiketler
                </h3>
                {selectedValues.map(({ node, description }) => (
                  <div key={node.nodeId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">
                        {node.displayName}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleNode(node)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Kaldır
                      </button>
                    </div>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) =>
                        handleDescriptionChange(node.nodeId, e.target.value)
                      }
                      placeholder="Açıklama giriniz"
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showIntervalSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold">Çekim Aralığı Seç</h2>
              <button
                onClick={() => setShowIntervalSelect(false)}
                className="text-gray-500"
              >
                X
              </button>
            </div>
            <div>
              <select
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full border rounded-md p-2"
              >
                {intervalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setShowIntervalSelect(false)}
                className="px-4 py-2 border rounded-md"
              >
                İptal
              </button>
              <button
                onClick={async () => {
                  const result = await saveSelected(interval);
                  if (result === 'success' || result === 'skipped') {
                    setShowIntervalSelect(false);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {editTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold">Etiketi Düzenle</h2>
              <button
                onClick={() => setEditTag(null)}
                className="text-gray-500"
              >
                X
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm">Etiket Adı</label>
                <input
                  type="text"
                  value={editTag.tagName}
                  disabled
                  className="mt-1 w-full border rounded-md p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm">Açıklama</label>
                <input
                  type="text"
                  value={editTag.description || ''}
                  onChange={(e) =>
                    setEditTag({ ...editTag!, description: e.target.value })
                  }
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
                <div>
                  <label className="block text-sm">Çekim Aralığı</label>
                  <select
                    value={editTag.pullInterval}
                    onChange={(e) =>
                      setEditTag({
                        ...editTag!,
                        pullInterval: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border rounded-md p-2"
                  >
                    {intervalOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm">Aktif</label>
                <input
                  type="checkbox"
                  checked={editTag.isActive}
                  onChange={(e) =>
                    setEditTag({ ...editTag!, isActive: e.target.checked })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setEditTag(null)}
                className="px-4 py-2 border rounded-md"
              >
                İptal
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {trendTag && (
        <TrendModal tag={trendTag} onClose={() => setTrendTag(null)} />
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
