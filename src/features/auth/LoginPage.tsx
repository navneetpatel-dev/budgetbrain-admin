import { useState, type FormEvent } from 'react';
import { login } from '../../shared/services/api';
import { BrandMark } from '../../shared/components/BrandMark';
import { FieldLimits, maxLen } from '../../shared/validation/fieldLimits';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (email.trim().length > FieldLimits.email.max) {
      next.email = `Email must be at most ${FieldLimits.email.max} characters`;
    } else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length > FieldLimits.password.max) {
      next.password = `Password must be at most ${FieldLimits.password.max} characters`;
    }
    setFieldErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-logo">
          <BrandMark size={30} />
        </div>
        <h1>
          Budget<span>Brain</span>
        </h1>
        <div className="divider" />
        <p>Track smarter. Save better.</p>
      </div>

      <div className="login-panel">
        <div className="login-panel-handle" aria-hidden />
        <h2>Admin sign in</h2>
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="error">{error}</div>}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={fieldErrors.email ? 'input-invalid' : undefined}
            placeholder="admin@example.com"
            value={email}
            maxLength={maxLen('email')}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((f) => ({ ...f, email: undefined }));
            }}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email ? (
            <p id="email-error" className="field-error">{fieldErrors.email}</p>
          ) : null}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={fieldErrors.password ? 'input-invalid' : undefined}
            placeholder="••••••••"
            value={password}
            maxLength={maxLen('password')}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((f) => ({ ...f, password: undefined }));
            }}
            autoComplete="current-password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          />
          {fieldErrors.password ? (
            <p id="password-error" className="field-error">{fieldErrors.password}</p>
          ) : null}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
