import api from './api';
import { BmcSystem, BmcSystemListResponse } from '../types';

export const systemService = {
  async list() {
    const { data } = await api.get<BmcSystemListResponse>('/systems');
    return data;
  },

  async get(systemId: number) {
    const { data } = await api.get<BmcSystem>(`/systems/${systemId}`);
    return data;
  },

  async healthCheck(systemId: number) {
    const { data } = await api.post<{ health_status: string }>(`/systems/${systemId}/health-check`);
    return data;
  },
};
