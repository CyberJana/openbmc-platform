import type { ReactElement } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SystemsPage } from "./pages/SystemsPage";
import { UsersPage } from "./pages/UsersPage";
import { useAuth } from "./state/AuthContext";

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="systems" element={<SystemsPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
