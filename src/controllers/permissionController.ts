import { permissionService, PermissionUserDto } from '../services/permissionService';
import { PageRequest } from '../services/templateService';

export interface RoleCounts {
  admin: number;
  operator: number;
  pending: number;
  total: number;
}

export const permissionController = {
  async getRoleCounts(page: PageRequest = { index: 0, size: 50 }): Promise<RoleCounts> {
    const res = await permissionService.listUsers(page);
    const users: PermissionUserDto[] = res.items || [];
    const admin = users.filter(u => u.roleName.toLowerCase() === 'admin').length;
    const operator = users.filter(u => u.roleName.toLowerCase() === 'operator').length;
    const pending = users.filter(u => u.status === false).length;
    const total = users.length;
    return { admin, operator, pending, total };
  },
};
