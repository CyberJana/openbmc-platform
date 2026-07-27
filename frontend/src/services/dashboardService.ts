import api from './api';
import { DashboardMetrics, DashboardStatus } from '../types';

export const dashboardService = {
  async getStatus(systemId: number) {
    const { data } = await api.get<DashboardStatus>('/dashboard/status', {
      params: { system_id: systemId },
    });
    return data;
  },

  async getMetrics(systemId: number) {
    const { data } = await api.get<DashboardMetrics>('/dashboard/metrics', {
      params: { system_id: systemId },
    });
    return data;
  },
};
