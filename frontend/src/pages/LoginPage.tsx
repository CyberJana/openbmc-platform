import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login({ email, password });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded border bg-white p-6 space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input id="password" type="password" className="w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-slate-900 text-white py-2 disabled:opacity-70" type="submit">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
