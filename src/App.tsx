import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { isLoggedIn, logout, verifyAdminSession } from './shared/services/api';
import { BrandMark } from './shared/components/BrandMark';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import UsersPage from './features/users/UsersPage';
import UserDetailPage from './features/users/UserDetailPage';
import SubscriptionsPage from './features/subscriptions/SubscriptionsPage';
import RevenuePage from './features/revenue/RevenuePage';
import AiUsagePage from './features/ai/AiUsagePage';
import SupportTicketsPage from './features/support/SupportTicketsPage';
import AuditLogsPage from './features/audit/AuditLogsPage';

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/subscriptions', label: 'Subscriptions' },
  { to: '/revenue', label: 'Revenue' },
  { to: '/ai-usage', label: 'AI Usage' },
  { to: '/support-tickets', label: 'Support' },
  { to: '/audit-logs', label: 'Audit Logs' },
] as const;

function Layout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <BrandMark />
          </div>
          <div className="brand-text">
            <h1>
              Budget<span>Brain</span>
            </h1>
            <p>Admin</p>
          </div>
        </div>
        <nav>
          {NAV.map(({ to, label, ...rest }) => (
            <NavLink key={to} to={to} {...rest}>
              {label}
            </NavLink>
          ))}
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
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/ai-usage" element={<AiUsagePage />} />
          <Route path="/support-tickets" element={<SupportTicketsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [checking, setChecking] = useState(loggedIn);

  useEffect(() => {
    if (!loggedIn) {
      setChecking(false);
      return;
    }
    verifyAdminSession().then((valid) => {
      setLoggedIn(valid);
      setChecking(false);
    });
  }, [loggedIn]);

  if (checking) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" aria-hidden />
        <span>Checking session…</span>
      </div>
    );
  }

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
