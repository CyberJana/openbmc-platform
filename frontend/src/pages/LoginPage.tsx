import { FormEvent, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ApiError } from "../services/api";
import { useAuth } from "../state/AuthContext";

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState("admin@openbmc.local");
  const [password, setPassword] = useState("OpenBMC@123!");
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  if (isAuthenticated) {
    const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to sign in right now.");
      }
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>OpenBMC Platform</h1>
        <p>Sign in to continue.</p>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button" disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
