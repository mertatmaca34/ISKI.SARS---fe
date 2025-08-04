import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  archiveTagService,
  ArchiveTagDto,
  opcService,
  TreeNode,
} from '../../services';
import { ConfirmToast } from '../ConfirmToast';
import { authStore } from '../../store/authStore';

export const ArchiveTagList: React.FC = () => {
  const [tags, setTags] = useState<ArchiveTagDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [selected, setSelected] = useState<Record<string, TreeNode>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [interval, setInterval] = useState(10);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailTag, setDetailTag] = useState<ArchiveTagDto | null>(null);
  const isAdmin = authStore.getCurrentUser()?.role === 'admin';
  const intervals = [1, 5, 10, 20, 30, 60, 300, 600, 3600, 86400];

  const loadTags = () =>
    archiveTagService
      .list({ index: 0, size: 100 })
      .then((res) => setTags(res.items))
      .catch(() => setTags([]));

  useEffect(() => {
    loadTags();
  }, []);

  const fetchTree = async () => {
    try {
      const res = await opcService.tree('');
      setTree(res.data);
      setExpanded({ [res.data.nodeId]: true });
    } catch {
      setTree(null);
    }
  };

  const toggleNode = (node: TreeNode) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[node.nodeId]) {
        delete copy[node.nodeId];
      } else {
        copy[node.nodeId] = node;
      }
      return copy;
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

  const saveSelected = async () => {
    const nodes = Object.values(selected);
    for (const node of nodes) {
      await archiveTagService.create({
        tagName: node.displayName,
        tagNodeId: node.nodeId,
        pullInterval: interval,
      });
    }
    setSelected({});
    setShowAdd(false);
    loadTags();
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

  return (
    <div className="space-y-6 px-2">
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
                {isAdmin && <th className="px-6 py-3" />}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etiket Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Node ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Çekim Aralığı (s)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setDetailTag(tag)}
                >
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(tag.id);
                        }}
                        className="p-2 rounded-md text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tag.tagName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {tag.tagNodeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tag.pullInterval}
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
            <div className="flex justify-between items-center p-4 border-b space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm">Çekim Süresi</label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="border rounded-md p-1"
                >
                  {intervals.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-x-2">
                <button
                  onClick={fetchTree}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Opc Taglarını Getir
                </button>
                <button
                  onClick={saveSelected}
                  disabled={Object.keys(selected).length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Kaydet
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {tree ? (
                <ul className="text-sm">{renderTree(tree)}</ul>
              ) : (
                <p className="text-center text-sm text-gray-500">Veri yok</p>
              )}
            </div>
          </div>
        </div>
      )}

      {detailTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-80 shadow-md">
            <h2 className="text-lg font-semibold mb-2">{detailTag.tagName}</h2>
            <p className="text-sm">
              <span className="font-medium">Node ID:</span> {detailTag.tagNodeId}
            </p>
            <p className="text-sm">
              <span className="font-medium">Çekim Aralığı:</span> {detailTag.pullInterval}s
            </p>
            <p className="text-sm">
              <span className="font-medium">Açıklama:</span> {detailTag.description || '-'}
            </p>
            <button
              onClick={() => setDetailTag(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Kapat
            </button>
          </div>
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
