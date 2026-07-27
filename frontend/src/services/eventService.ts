import api from './api';
import { EventResponse } from '../types';

export const eventService = {
  async list(systemId: number) {
    const { data } = await api.get<EventResponse>('/events', { params: { system_id: systemId } });
    return data;
  },

  async summary(systemId: number) {
    const { data } = await api.get('/events/summary', { params: { system_id: systemId } });
    return data;
  },
};
