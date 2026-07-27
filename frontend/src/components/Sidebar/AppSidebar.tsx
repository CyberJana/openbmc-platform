import { NavLink } from 'react-router-dom';

const links = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/systems', label: 'Systems' },
  { path: '/sensors', label: 'Sensors' },
  { path: '/events', label: 'Events' },
  { path: '/users', label: 'Users' },
  { path: '/settings', label: 'Settings' },
];

function AppSidebar() {
  return (
    <aside className="w-full md:w-56 border-r border-slate-200 md:min-h-screen p-3 md:p-4 bg-white dark:bg-slate-900">
      <nav className="grid gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `rounded px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AppSidebar;
