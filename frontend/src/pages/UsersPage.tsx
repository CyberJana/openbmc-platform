import { FormEvent, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../state/AuthContext";
import type { User } from "../types";

interface UserForm {
  email: string;
  full_name: string;
  password: string;
}

const initialForm: UserForm = {
  email: "",
  full_name: "",
  password: "",
};

export function UsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [draft, setDraft] = useState<UserForm>(initialForm);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    if (!accessToken) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.users.list(accessToken);
      setUsers(response.users);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load users.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [accessToken]);

  useEffect(() => {
    if (!editingUser) {
      setDraft(initialForm);
      return;
    }
    setDraft({
      email: editingUser.email,
      full_name: editingUser.full_name ?? "",
      password: "",
    });
  }, [editingUser]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      return;
    }
    setError(null);
    try {
      if (editingUser) {
        const payload: { full_name?: string; password?: string } = {};
        if (draft.full_name.trim()) {
          payload.full_name = draft.full_name.trim();
        }
        if (draft.password.trim()) {
          payload.password = draft.password;
        }
        await api.users.update(accessToken, editingUser.id, payload);
      } else {
        await api.users.create(accessToken, {
          email: draft.email.trim(),
          full_name: draft.full_name.trim() || undefined,
          password: draft.password,
        });
      }
      setEditingUser(null);
      setDraft(initialForm);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save user.";
      setError(message);
    }
  };

  const onDelete = async (id: number) => {
    if (!accessToken) {
      return;
    }
    setError(null);
    try {
      await api.users.remove(accessToken, id);
      if (editingUser?.id === id) {
        setEditingUser(null);
      }
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete user.";
      setError(message);
    }
  };

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h2>Users</h2>
          <p>Create and manage platform users.</p>
        </div>
      </header>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <h3>{editingUser ? `Edit user #${editingUser.id}` : "Create user"}</h3>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={draft.email}
              onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
              required={!editingUser}
              disabled={Boolean(editingUser)}
            />
          </label>
          <label>
            Full name
            <input
              value={draft.full_name}
              onChange={(event) => setDraft((current) => ({ ...current, full_name: event.target.value }))}
            />
          </label>
          <label>
            Password {editingUser ? "(optional)" : ""}
            <input
              type="password"
              value={draft.password}
              onChange={(event) => setDraft((current) => ({ ...current, password: event.target.value }))}
              required={!editingUser}
              minLength={8}
            />
          </label>
          <div className="action-row">
            <button className="button" type="submit">
              {editingUser ? "Update user" : "Create user"}
            </button>
            {editingUser ? (
              <button
                className="button button-ghost"
                onClick={() => {
                  setEditingUser(null);
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
        <h3>User directory</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.full_name ?? "N/A"}</td>
                  <td>{user.is_superadmin ? "Superadmin" : "User"}</td>
                  <td className="row-actions">
                    <button className="button button-small" onClick={() => setEditingUser(user)} type="button">
                      Edit
                    </button>
                    <button
                      className="button button-small button-danger"
                      onClick={() => onDelete(user.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={5}>No users available.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
