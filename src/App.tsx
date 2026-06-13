import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { isLoggedIn, clearToken } from './services/api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AuditLogsPage from './pages/AuditLogsPage';

function Layout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>ExpenseFlow</h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/subscriptions">Subscriptions</NavLink>
          <NavLink to="/audit-logs">Audit Logs</NavLink>
        </nav>
        <button style={{ marginTop: 32, background: '#4338ca' }} onClick={onLogout}>
          Sign Out
        </button>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <Layout
        onLogout={() => {
          clearToken();
          setLoggedIn(false);
        }}
      />
    </BrowserRouter>
  );
}
