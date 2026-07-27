import { Outlet, useNavigate } from 'react-router-dom';
import AppSidebar from '../Sidebar/AppSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';

function AppLayout() {
  const { logout, user } = useAuth();
  const { darkMode, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen md:flex bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
      <AppSidebar />
      <div className="flex-1">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <h1 className="text-lg font-semibold">OpenBMC Platform</h1>
          <div className="flex items-center gap-2">
            <button className="rounded border px-3 py-1 text-sm" onClick={toggleTheme}>
              {darkMode ? 'Light' : 'Dark'} mode
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</span>
            <button className="rounded bg-slate-900 text-white px-3 py-1 text-sm dark:bg-slate-100 dark:text-slate-900" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
