import api from './api';
import { SensorResponse } from '../types';

export const sensorService = {
  async list(systemId: number) {
    const { data } = await api.get<SensorResponse>('/sensors', { params: { system_id: systemId } });
    return data;
  },

  async temperatures(systemId: number) {
    const { data } = await api.get<SensorResponse>('/sensors/temperature', { params: { system_id: systemId } });
    return data;
  },

  async fans(systemId: number) {
    const { data } = await api.get<SensorResponse>('/sensors/fans', { params: { system_id: systemId } });
    return data;
  },

  async power(systemId: number) {
    const { data } = await api.get<SensorResponse>('/sensors/power', { params: { system_id: systemId } });
    return data;
  },
};
