import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../state/AuthContext";
import type { BMCSystem, DashboardMetricsResponse, DashboardStatusResponse, HealthResponse } from "../types";
import { MultiTimezoneClock } from "../components/MultiTimezoneClock";
import { StatusCard } from "../components/StatusCard";

function healthTone(value: string): "default" | "good" | "warn" | "critical" {
  const normalized = value.toLowerCase();
  if (normalized.includes("healthy") || normalized.includes("ok")) {
    return "good";
  }
  if (normalized.includes("warning")) {
    return "warn";
  }
  if (normalized.includes("critical") || normalized.includes("error")) {
    return "critical";
  }
  return "default";
}

export function DashboardPage() {
  const { accessToken } = useAuth();
  const [systems, setSystems] = useState<BMCSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const [status, setStatus] = useState<DashboardStatusResponse | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
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
    async function loadDashboard() {
      if (!accessToken || !selectedSystemId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [statusData, metricsData, healthData] = await Promise.all([
          api.dashboard.status(accessToken, selectedSystemId),
          api.dashboard.metrics(accessToken, selectedSystemId),
          api.dashboard.health(accessToken, selectedSystemId),
        ]);
        setStatus(statusData);
        setMetrics(metricsData);
        setHealth(healthData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load dashboard.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    void loadDashboard();
  }, [accessToken, selectedSystemId]);

  const selectedSystem = useMemo(
    () => systems.find((system) => system.id === selectedSystemId) ?? null,
    [selectedSystemId, systems],
  );

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>System health, metrics, and global time tracking.</p>
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

      {selectedSystem ? (
        <section className="panel">
          <h3>Selected system</h3>
          <p>
            {selectedSystem.name} | Host: {selectedSystem.host}:{selectedSystem.port}
          </p>
          <p>
            Firmware: {selectedSystem.firmware_version ?? "N/A"} | BIOS: {selectedSystem.bios_version ?? "N/A"} |
            Model: {selectedSystem.model ?? "N/A"}
          </p>
        </section>
      ) : null}

      <section className="card-grid">
        <StatusCard
          title="Platform health"
          value={health?.status ?? (isLoading ? "Loading..." : "Unknown")}
          subtitle={health?.environment ?? "n/a"}
          tone={health ? healthTone(health.status) : "default"}
        />
        <StatusCard
          title="System status"
          value={status?.status ?? (isLoading ? "Loading..." : "Unknown")}
          subtitle={status?.message}
          tone={status ? healthTone(status.status) : "default"}
        />
        <StatusCard
          title="CPU usage"
          value={metrics ? `${metrics.cpu_usage.toFixed(1)}%` : isLoading ? "Loading..." : "N/A"}
          subtitle={status?.timestamp ? new Date(status.timestamp).toLocaleString() : undefined}
          tone="default"
        />
        <StatusCard
          title="Memory usage"
          value={metrics ? `${metrics.memory_usage.toFixed(1)}%` : isLoading ? "Loading..." : "N/A"}
          subtitle={metrics ? `Power ${metrics.power_watts.toFixed(1)}W` : undefined}
          tone="default"
        />
      </section>

      <MultiTimezoneClock />
    </div>
  );
}
