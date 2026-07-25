import { Link } from 'react-router-dom';
import { useState } from 'react';
import { apiGet } from '../../shared/services/api';
import { useCachedResource } from '../../shared/hooks/useCachedResource';
import Pagination from '../../shared/components/Pagination';
import { ErrorState, EmptyState } from '../../shared/components/PageStates';
import { AdminTableSkeleton } from '../../shared/components/Skeleton';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isSuspended?: boolean;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, error, loading, refreshing, reload } = useCachedResource<UsersResponse>(
    `users:${page}`,
    () => apiGet<UsersResponse>(`/admin/users?page=${page}&limit=${LIMIT}`)
  );

  const users = data?.users ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <h2 className="page-title">Users</h2>
      {loading && <AdminTableSkeleton rows={8} columns={5} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && users.length === 0 && <EmptyState message="No users found." />}
      {!loading && !error && users.length > 0 && (
        <div className={`card${refreshing ? ' is-refreshing' : ''}`}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link to={`/users/${u.id}`} className="link">
                      {u.name ?? '—'}
                    </Link>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    {u.isSuspended ? (
                      <span className="badge badge-suspended">Suspended</span>
                    ) : (
                      <span className="badge badge-active">Active</span>
                    )}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
