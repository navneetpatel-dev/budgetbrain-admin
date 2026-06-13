import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { isLoggedIn, logout, verifyAdminSession } from './services/api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import RevenuePage from './pages/RevenuePage';
import AiUsagePage from './pages/AiUsagePage';
import SupportTicketsPage from './pages/SupportTicketsPage';
import AuditLogsPage from './pages/AuditLogsPage';

function Layout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>ExpenseFlow</h1>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/subscriptions">Subscriptions</NavLink>
          <NavLink to="/revenue">Revenue</NavLink>
          <NavLink to="/ai-usage">AI Usage</NavLink>
          <NavLink to="/support-tickets">Support Tickets</NavLink>
          <NavLink to="/audit-logs">Audit Logs</NavLink>
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
    return <div className="loading-screen">Checking session…</div>;
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
