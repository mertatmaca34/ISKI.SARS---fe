import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  tagService,
  templateService,
  opcService,
  ReportTemplateTagDto,
  TreeNode,
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
  const [templateName, setTemplateName] = useState('');
  const [opcEndpoint, setOpcEndpoint] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [selected, setSelected] = useState<Record<string, TreeNode>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingTree, setLoadingTree] = useState(false);

  const loadTags = useCallback(() => {
    tagService
      .list({ index: 0, size: 100 })
      .then((res) =>
        setTags(res.items.filter((t) => t.reportTemplateId === templateId))
      )
      .catch(() => setTags([]));
  }, [templateId]);

  useEffect(() => {
    templateService
      .getById(templateId)
      .then((res) => {
        setTemplateName(res.name);
        setOpcEndpoint(res.opcEndpoint);
      })
      .catch(() => {
        setTemplateName('');
        setOpcEndpoint('');
      });
    loadTags();
  }, [templateId, loadTags]);

  const fetchTree = async () => {
    setLoadingTree(true);
    try {
      const res = await opcService.tree('');
      setTree(res.data);
      setExpanded({ [res.data.nodeId]: true });
    } catch {
      try {
        if (opcEndpoint) {
          await opcService.connect(opcEndpoint);
          const res = await opcService.tree('');
          setTree(res.data);
          setExpanded({ [res.data.nodeId]: true });
        } else {
          setTree(null);
        }
      } catch {
        setTree(null);
      }
    } finally {
      setLoadingTree(false);
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

  const saveTags = async () => {
    const newNodes = Object.values(selected);
    for (const node of newNodes) {
      if (!tags.some((t) => t.tagNodeId === node.nodeId)) {
        await tagService.create({
          reportTemplateId: templateId,
          tagName: node.displayName,
          tagNodeId: node.nodeId,
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

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderTree = (node: TreeNode) => {
    const isLeaf = node.nodeClass === 'Variable';
    const isOpen = expanded[node.nodeId];

    return (
      <li key={node.nodeId} className="mt-1">
        <div className="flex items-center space-x-2">
          {!isLeaf && (
            <button
              onClick={() => toggleExpand(node.nodeId)}
              className="w-4 h-4 flex items-center justify-center"
            >
              {isOpen ? '▾' : '▸'}
            </button>
          )}
          {isLeaf ? (
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!selected[node.nodeId]}
                onChange={() => toggleNode(node)}
              />
              <span>{node.displayName}</span>
            </label>
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

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiket Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Node ID
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tag.tagName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {tag.tagNodeId}
                      </td>
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
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex justify-end p-4 border-b">
              <button
                onClick={fetchTree}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Opc Taglarını Getir
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              {loadingTree && (
                <p className="text-center text-sm text-gray-500">Yükleniyor...</p>
              )}
              {!loadingTree && tree && (
                <ul className="text-sm">{renderTree(tree)}</ul>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={saveTags}
              disabled={Object.keys(selected).length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Kaydet
            </button>
          </div>
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
