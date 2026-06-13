import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet, apiPatch } from '../services/api';
import { LoadingState, ErrorState } from '../components/PageStates';

type UserRole = 'free' | 'premium' | 'lifetime' | 'admin';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isSuspended: boolean;
  country: string | null;
  currency: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLES: UserRole[] = ['free', 'premium', 'lifetime', 'admin'];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole>('free');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiGet<UserDetail>(`/admin/users/${id}`);
      setUser(data);
      setRole(data.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const saveRole = async () => {
    if (!id) return;
    setSaving(true);
    setActionError('');
    try {
      const updated = await apiPatch<UserDetail>(`/admin/users/${id}`, { role });
      setUser(updated);
      setRole(updated.role);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  const toggleSuspend = async () => {
    if (!id || !user) return;
    setSaving(true);
    setActionError('');
    try {
      const updated = await apiPatch<UserDetail>(`/admin/users/${id}`, {
        suspended: !user.isSuspended,
      });
      setUser(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update suspension');
    } finally {
      setSaving(false);
    }
  };

  if (!id) return <ErrorState message="Invalid user ID" />;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!user) return <ErrorState message="User not found" onRetry={load} />;

  return (
    <div>
      <div className="page-header">
        <Link to="/users" className="back-link">
          ← Back to Users
        </Link>
        <h2 className="page-title">{user.name ?? user.email}</h2>
      </div>

      {actionError && <div className="error">{actionError}</div>}

      <div className="grid">
        <div className="card">
          <h3 className="section-title">Profile</h3>
          <dl className="detail-list">
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Name</dt>
            <dd>{user.name ?? '—'}</dd>
            <dt>Country</dt>
            <dd>{user.country ?? '—'}</dd>
            <dt>Currency</dt>
            <dd>{user.currency}</dd>
            <dt>Email Verified</dt>
            <dd>{user.emailVerified ? 'Yes' : 'No'}</dd>
            <dt>Onboarding</dt>
            <dd>{user.onboardingCompleted ? 'Complete' : 'Incomplete'}</dd>
            <dt>Last Login</dt>
            <dd>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}</dd>
            <dt>Joined</dt>
            <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
          </dl>
        </div>

        <div className="card">
          <h3 className="section-title">Admin Actions</h3>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className="select"
              value={role}
              disabled={saving}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-secondary"
              disabled={saving || role === user.role}
              onClick={saveRole}
            >
              {saving ? 'Saving...' : 'Update Role'}
            </button>
          </div>

          <div className="form-group">
            <p>
              Status:{' '}
              {user.isSuspended ? (
                <span className="badge badge-suspended">Suspended</span>
              ) : (
                <span className="badge badge-active">Active</span>
              )}
            </p>
            <button
              type="button"
              className={user.isSuspended ? 'btn-secondary' : 'btn-danger'}
              disabled={saving}
              onClick={toggleSuspend}
            >
              {saving
                ? 'Updating...'
                : user.isSuspended
                  ? 'Reinstate User'
                  : 'Suspend User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
