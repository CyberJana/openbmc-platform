import { useEffect, useState } from 'react';
import StatusCard from '../components/Common/StatusCard';
import MultiTimezoneClock from '../components/MultiTimezoneClock';
import { dashboardService } from '../services/dashboardService';
import { DashboardMetrics, DashboardStatus } from '../types';

const DEFAULT_SYSTEM_ID = 1;

function DashboardPage() {
  const [status, setStatus] = useState<DashboardStatus | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statusData, metricsData] = await Promise.all([
          dashboardService.getStatus(DEFAULT_SYSTEM_ID),
          dashboardService.getMetrics(DEFAULT_SYSTEM_ID),
        ]);
        setStatus(statusData);
        setMetrics(metricsData);
      } catch (err) {
        setError('Unable to load dashboard data.');
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard label="System Status" value={status?.status ?? 'Loading'} />
        <StatusCard label="CPU Usage" value={metrics ? `${metrics.cpu_usage}%` : '...'} />
        <StatusCard label="Memory Usage" value={metrics ? `${metrics.memory_usage}%` : '...'} />
        <StatusCard label="Temperature" value={metrics ? `${metrics.temperature_c}°C` : '...'} />
      </div>
      <div className="rounded border p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
        <h3 className="font-medium mb-2">Recent Events</h3>
        <p className="text-sm text-slate-500">Events integration is available on the Events page.</p>
      </div>
      <MultiTimezoneClock />
    </div>
  );
}

export default DashboardPage;
