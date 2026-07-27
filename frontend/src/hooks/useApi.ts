import { useMemo } from 'react';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import { eventService } from '../services/eventService';
import { sensorService } from '../services/sensorService';
import { systemService } from '../services/systemService';
import { userService } from '../services/userService';

export function useApi() {
  return useMemo(
    () => ({
      auth: authService,
      dashboard: dashboardService,
      events: eventService,
      sensors: sensorService,
      systems: systemService,
      users: userService,
    }),
    []
  );
}
