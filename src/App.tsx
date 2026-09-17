import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { isLoggedIn, logout, verifyAdminSession } from './shared/services/api';
import { BrandMark } from './shared/components/BrandMark';
import { AdminLoginSkeleton } from './shared/components/Skeleton';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import UsersPage from './features/users/UsersPage';
import UserDetailPage from './features/users/UserDetailPage';
import AiUsagePage from './features/ai/AiUsagePage';
import SupportTicketsPage from './features/support/SupportTicketsPage';
import AuditLogsPage from './features/audit/AuditLogsPage';
import './styles.css';

function Layout({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark size={36} showBackground={false} />
          <div className="brand-text">
            <h1>Budget<span>Brain</span></h1>
            <p>Admin Portal</p>
          </div>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
            Users
          </NavLink>
          <NavLink to="/ai-usage" className={({ isActive }) => (isActive ? 'active' : '')}>
            AI Usage
          </NavLink>
          <NavLink to="/support-tickets" className={({ isActive }) => (isActive ? 'active' : '')}>
            Support
          </NavLink>
          <NavLink to="/audit-logs" className={({ isActive }) => (isActive ? 'active' : '')}>
            Audit Logs
          </NavLink>
        </nav>
        <button type="button" className="btn-logout" onClick={onLogout}>
          Sign Out
        </button>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/ai-usage" element={<AiUsagePage />} />
          <Route path="/support-tickets" element={<SupportTicketsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
      setChecking(false);
      return;
    }
    verifyAdminSession().then((valid) => {
      setLoggedIn(valid);
      setChecking(false);
    });
  }, [loggedIn]);

  if (checking) return <AdminLoginSkeleton />;

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <Layout
        onLogout={async () => {
          await logout();
          setLoggedIn(false);
        }}
      />
    </BrowserRouter>
  );
}
