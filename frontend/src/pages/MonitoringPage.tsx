import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../state/AuthContext";
import type {
  BMCSystem,
  EventSummaryResponse,
  EventsResponse,
  SensorsResponse,
} from "../types";
import { StatusCard } from "../components/StatusCard";

export function MonitoringPage() {
  const { accessToken } = useAuth();
  const [systems, setSystems] = useState<BMCSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const [allSensors, setAllSensors] = useState<SensorsResponse | null>(null);
  const [temperatureSensors, setTemperatureSensors] = useState<SensorsResponse | null>(null);
  const [fanSensors, setFanSensors] = useState<SensorsResponse | null>(null);
  const [powerSensors, setPowerSensors] = useState<SensorsResponse | null>(null);
  const [events, setEvents] = useState<EventsResponse | null>(null);
  const [eventSummary, setEventSummary] = useState<EventSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSystems() {
      if (!accessToken) {
        return;
      }
      try {
        const response = await api.systems.list(accessToken);
        setSystems(response.systems);
        if (response.systems.length > 0) {
          setSelectedSystemId((current) => current ?? response.systems[0].id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load systems.";
        setError(message);
      }
    }

    void loadSystems();
  }, [accessToken]);

  useEffect(() => {
    async function loadMonitoringData() {
      if (!accessToken || !selectedSystemId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [all, temp, fan, power, eventsData, summary] = await Promise.all([
          api.sensors.all(accessToken, selectedSystemId),
          api.sensors.temperature(accessToken, selectedSystemId),
          api.sensors.fans(accessToken, selectedSystemId),
          api.sensors.power(accessToken, selectedSystemId),
          api.events.list(accessToken, selectedSystemId),
          api.events.summary(accessToken, selectedSystemId),
        ]);
        setAllSensors(all);
        setTemperatureSensors(temp);
        setFanSensors(fan);
        setPowerSensors(power);
        setEvents(eventsData);
        setEventSummary(summary);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load monitoring data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadMonitoringData();
  }, [accessToken, selectedSystemId]);

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h2>Monitoring</h2>
          <p>Sensor and event telemetry for registered BMC systems.</p>
        </div>
        <label className="inline-field">
          <span>System</span>
          <select
            value={selectedSystemId ?? ""}
            onChange={(event) => setSelectedSystemId(Number(event.target.value))}
            disabled={systems.length === 0}
          >
            {systems.length === 0 ? <option value="">No systems available</option> : null}
            {systems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name} ({system.host})
              </option>
            ))}
          </select>
        </label>
      </header>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="card-grid">
        <StatusCard
          title="Total sensors"
          value={allSensors?.total?.toString() ?? (isLoading ? "Loading..." : "0")}
          tone="default"
        />
        <StatusCard
          title="Temperature sensors"
          value={temperatureSensors?.sensors.length.toString() ?? (isLoading ? "Loading..." : "0")}
          tone="default"
        />
        <StatusCard
          title="Fan sensors"
          value={fanSensors?.sensors.length.toString() ?? (isLoading ? "Loading..." : "0")}
          tone="default"
        />
        <StatusCard
          title="Power sensors"
          value={powerSensors?.sensors.length.toString() ?? (isLoading ? "Loading..." : "0")}
          tone="default"
        />
        <StatusCard
          title="Total events"
          value={eventSummary?.total_count.toString() ?? (isLoading ? "Loading..." : "0")}
          tone="default"
        />
        <StatusCard
          title="Critical events"
          value={eventSummary?.critical_count.toString() ?? (isLoading ? "Loading..." : "0")}
          tone={eventSummary && eventSummary.critical_count > 0 ? "critical" : "good"}
        />
      </section>

      <section className="panel">
        <h3>Recent events</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Type</th>
                <th>Message</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {(events?.events ?? []).map((event) => (
                <tr key={event.id}>
                  <td>{event.severity}</td>
                  <td>{event.event_type}</td>
                  <td>{event.message}</td>
                  <td>{event.event_timestamp ?? "N/A"}</td>
                </tr>
              ))}
              {!isLoading && (events?.events.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={4}>No events available for this system.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
