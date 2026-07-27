import api from './api';
import { LoginRequest, LoginResponse } from '../types';

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },
};
