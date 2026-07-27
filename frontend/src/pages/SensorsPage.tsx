import { useEffect, useState } from 'react';
import { sensorService } from '../services/sensorService';
import { SensorRecord } from '../types';

const DEFAULT_SYSTEM_ID = 1;

function SensorsPage() {
  const [sensors, setSensors] = useState<SensorRecord[]>([]);

  useEffect(() => {
    sensorService.temperatures(DEFAULT_SYSTEM_ID).then((response) => setSensors(response.sensors));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sensors</h2>
      <div className="rounded border bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
        <p className="text-sm text-slate-500 mb-3">Temperature sensors (real-time endpoint)</p>
        <ul className="space-y-2">
          {sensors.map((sensor, index) => (
            <li key={sensor.id ?? index} className="text-sm">
              {sensor.name ?? 'Sensor'}: {sensor.reading ?? 'N/A'} {sensor.unit ?? ''}
            </li>
          ))}
          {sensors.length === 0 ? <li className="text-sm text-slate-500">No sensor data returned.</li> : null}
        </ul>
      </div>
    </div>
  );
}

export default SensorsPage;
