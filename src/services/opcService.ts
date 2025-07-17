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
  children: string[];
}

export const opcService = {
  connect: (endpoint: string) =>
    api.post<ApiResponse<string>>('/api/Opc/Connect', { endpoint }),
  read: (nodeId: string) =>
    api.get<ApiResponse<OpcReadResult>>(`/api/Opc/read?nodeId=${encodeURIComponent(nodeId)}`),
  write: (nodeId: string, value: string) =>
    api.post<ApiResponse<string>>('/api/Opc/Write', { nodeId, value }),
  browse: (nodeId: string) =>
    api.get<ApiResponse<BrowseItem[]>>(`/api/Opc/Browse?nodeId=${encodeURIComponent(nodeId)}`),
  tree: (nodeId: string) =>
    api.get<ApiResponse<TreeNode>>(`/api/Opc/tree?nodeId=${encodeURIComponent(nodeId)}`),
  discover: (networkPrefix: string, port: number) =>
    api.get<ApiResponse<string[]>>(
      `/api/Discover?networkPrefix=${encodeURIComponent(networkPrefix)}&port=${port}`
    ),
  disconnect: () => api.post<ApiResponse<unknown>>('/api/Opc/disconnect'),
};