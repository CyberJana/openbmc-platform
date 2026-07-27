import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth';

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.is_superadmin) {
      return;
    }

    userService
      .list()
      .then((response) => setUsers(response.users))
      .catch(() => setError('Unable to load users.'));
  }, [user]);

  if (!user?.is_superadmin) {
    return <p className="text-sm text-slate-500">Only super admins can view user management.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>
      {error ? <p className="text-red-600">{error}</p> : null}
      <div className="rounded border bg-white dark:bg-slate-900 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.full_name ?? '-'}</td>
                <td className="p-3">{item.is_superadmin ? 'Super Admin' : 'User'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;
