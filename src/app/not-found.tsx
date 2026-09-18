import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 32,
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>404</h1>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400 }}>
        The requested admin page does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-primary"
        style={{ textDecoration: 'none' }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
