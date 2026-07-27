import { useEffect, useState } from 'react';
import { systemService } from '../services/systemService';
import { BmcSystem } from '../types';

function SystemsPage() {
  const [systems, setSystems] = useState<BmcSystem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    systemService
      .list()
      .then((response) => setSystems(response.systems))
      .catch(() => setError('Unable to load systems.'));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Systems</h2>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="overflow-auto rounded border bg-white dark:bg-slate-900 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Host</th>
              <th className="p-3">Health</th>
              <th className="p-3">Firmware</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((system) => (
              <tr key={system.id} className="border-b last:border-0">
                <td className="p-3">{system.name}</td>
                <td className="p-3">{system.host}</td>
                <td className="p-3">{system.health_status}</td>
                <td className="p-3">{system.firmware_version ?? '-'}</td>
              </tr>
            ))}
            {systems.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={4}>No systems available.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemsPage;
