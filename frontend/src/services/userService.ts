import api from './api';
import { User } from '../types';

interface UserListResponse {
  total: number;
  users: User[];
}

export const userService = {
  async list() {
    const { data } = await api.get<UserListResponse>('/users');
    return data;
  },
};
