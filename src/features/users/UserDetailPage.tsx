import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet, apiPatch } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import { ErrorState } from '../../shared/components/PageStates';
import { AdminDetailSkeleton } from '../../shared/components/Skeleton';

type UserRole = 'free' | 'admin';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isSuspended: boolean;
  country: string | null;
  currency: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLES: UserRole[] = ['free', 'admin'];

function toEditableRole(role: string): UserRole {
  return role === 'admin' ? 'admin' : 'free';
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole>('free');

  const { data: user, error, loading, refreshing, reload, setData } = useCachedResource<UserDetail>(
    id ? `user:${id}` : 'user:invalid',
    async () => {
      if (!id) throw new Error('Invalid user ID');
      return apiGet<UserDetail>(`/admin/users/${id}`);
    }
  );

  useEffect(() => {
    if (user) setRole(toEditableRole(user.role));
  }, [user]);

  const saveRole = async () => {
    if (!id) return;
    setSaving(true);
    setActionError('');
    try {
      const updated = await apiPatch<UserDetail>(`/admin/users/${id}`, { role });
      setData(updated);
      setRole(toEditableRole(updated.role));
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
      setData(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update suspension');
    } finally {
      setSaving(false);
    }
  };

  if (!id) return <ErrorState message="Invalid user ID" />;

  return (
    <div>
      {loading && <AdminDetailSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && user && (
        <>
          <div className="page-header">
            <div>
              <Link to="/users" className="back-link">
                ← Back to Users
              </Link>
              <h2 className="page-title" style={{ marginTop: 6 }}>{user.name ?? user.email}</h2>
              <p className="page-subtitle">
                <span className={`badge badge-${user.role}`} style={{ marginRight: 6 }}>{user.role}</span>
                {user.isSuspended
                  ? <span className="badge badge-suspended">Suspended</span>
                  : <span className="badge badge-active">Active</span>}
              </p>
            </div>
          </div>

          {actionError && <div className="error">{actionError}</div>}

          <div className={`grid${refreshing ? ' is-refreshing' : ''}`}>
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
        </>
      )}
    </div>
  );
}
