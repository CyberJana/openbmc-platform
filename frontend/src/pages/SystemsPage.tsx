import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../state/AuthContext";
import type { BMCSystem } from "../types";

interface SystemForm {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  verify_ssl: boolean;
}

const initialForm: SystemForm = {
  name: "",
  host: "",
  port: 443,
  username: "",
  password: "",
  verify_ssl: false,
};

export function SystemsPage() {
  const { accessToken } = useAuth();
  const [systems, setSystems] = useState<BMCSystem[]>([]);
  const [draft, setDraft] = useState<SystemForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const editingSystem = useMemo(
    () => systems.find((system) => system.id === editingId) ?? null,
    [editingId, systems],
  );

  const loadSystems = async () => {
    if (!accessToken) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.systems.list(accessToken);
      setSystems(response.systems);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load systems.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSystems();
  }, [accessToken]);

  useEffect(() => {
    if (!editingSystem) {
      setDraft(initialForm);
      return;
    }
    setDraft({
      name: editingSystem.name,
      host: editingSystem.host,
      port: editingSystem.port,
      username: editingSystem.username,
      password: editingSystem.password,
      verify_ssl: editingSystem.verify_ssl,
    });
  }, [editingSystem]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      return;
    }
    setError(null);
    try {
      if (editingId) {
        await api.systems.update(accessToken, editingId, draft);
      } else {
        await api.systems.create(accessToken, draft);
      }
      setEditingId(null);
      setDraft(initialForm);
      await loadSystems();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save system.";
      setError(message);
    }
  };

  const onDelete = async (id: number) => {
    if (!accessToken) {
      return;
    }
    setError(null);
    try {
      await api.systems.remove(accessToken, id);
      if (editingId === id) {
        setEditingId(null);
      }
      await loadSystems();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete system.";
      setError(message);
    }
  };

  const onHealthCheck = async (id: number) => {
    if (!accessToken) {
      return;
    }
    setError(null);
    try {
      await api.systems.healthCheck(accessToken, id);
      await loadSystems();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to run health check.";
      setError(message);
    }
  };

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h2>BMC Systems</h2>
          <p>Register and manage BMC endpoints used by monitoring and dashboard pages.</p>
        </div>
      </header>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <h3>{editingId ? "Edit system" : "Add new system"}</h3>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>
          <label>
            Host
            <input
              value={draft.host}
              onChange={(event) => setDraft((current) => ({ ...current, host: event.target.value }))}
              required
            />
          </label>
          <label>
            Port
            <input
              type="number"
              min={1}
              max={65535}
              value={draft.port}
              onChange={(event) =>
                setDraft((current) => ({ ...current, port: Number.parseInt(event.target.value, 10) }))
              }
              required
            />
          </label>
          <label>
            Username
            <input
              value={draft.username}
              onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={draft.password}
              onChange={(event) => setDraft((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={draft.verify_ssl}
              onChange={(event) => setDraft((current) => ({ ...current, verify_ssl: event.target.checked }))}
            />
            Verify SSL certificate
          </label>
          <div className="action-row">
            <button className="button" type="submit">
              {editingId ? "Update system" : "Create system"}
            </button>
            {editingId ? (
              <button
                className="button button-ghost"
                onClick={() => {
                  setEditingId(null);
                  setDraft(initialForm);
                }}
                type="button"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="panel">
        <h3>Registered systems</h3>
        <p>Total: {systems.length}</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Host</th>
                <th>Health</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system) => (
                <tr key={system.id}>
                  <td>{system.name}</td>
                  <td>
                    {system.host}:{system.port}
                  </td>
                  <td>{system.health_status}</td>
                  <td className="row-actions">
                    <button className="button button-small" onClick={() => setEditingId(system.id)} type="button">
                      Edit
                    </button>
                    <button className="button button-small" onClick={() => onHealthCheck(system.id)} type="button">
                      Health check
                    </button>
                    <button
                      className="button button-small button-danger"
                      onClick={() => onDelete(system.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && systems.length === 0 ? (
                <tr>
                  <td colSpan={4}>No systems available.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
