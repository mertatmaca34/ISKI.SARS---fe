import { userService, UserDto } from '../services';
import { PaginatedResponse, PageRequest } from '../services/templateService';

export const userController = {
  async list(page: PageRequest = { index: 0, size: 50 }): Promise<PaginatedResponse<UserDto>> {
    return await userService.list(page);
  },

  async delete(id: string): Promise<void> {
    await userService.delete(id);
  },
};
