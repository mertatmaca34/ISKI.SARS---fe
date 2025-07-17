import { api } from './api';

export interface ApiResponse<T> {
  success: boolean;
  serverStatus: string;
  timestamp: string;
  message: string;
  data: T;
}

export interface OpcReadResult {
  nodeId: string;
  value: string;
  nodeStatus: string;
}

export interface BrowseItem {
  displayName: string;
  nodeId: string;
  nodeClass: string;
}

export interface TreeNode {
  displayName: string;
  nodeId: string;
  nodeClass: string;
  children: TreeNode[];
}

export const opcService = {
  connect: (endpoint: string) =>
    api.post<ApiResponse<string>>('/Opc/Connect', endpoint),
  read: (nodeId: string) =>
    api.get<ApiResponse<OpcReadResult>>(`/Opc/read?nodeId=${encodeURIComponent(nodeId)}`),
  write: (nodeId: string, value: string) =>
    api.post<ApiResponse<string>>('/Opc/Write', { nodeId, value }),
  browse: (nodeId: string) =>
    api.get<ApiResponse<BrowseItem[]>>(`/Opc/Browse?nodeId=${encodeURIComponent(nodeId)}`),
  tree: (nodeId: string) =>
    api.get<ApiResponse<TreeNode>>(`/Opc/tree?nodeId=${encodeURIComponent(nodeId)}`),
  discover: (networkPrefix: string, port: number) =>
    api.get<ApiResponse<string[]>>(`/Discover?networkPrefix=${encodeURIComponent(networkPrefix)}&port=${port}`),
  disconnect: () => api.post<ApiResponse<unknown>>('/Opc/disconnect'),
};
