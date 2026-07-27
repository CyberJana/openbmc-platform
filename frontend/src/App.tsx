import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import SensorsPage from './pages/SensorsPage';
import SettingsPage from './pages/SettingsPage';
import SystemsPage from './pages/SystemsPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
