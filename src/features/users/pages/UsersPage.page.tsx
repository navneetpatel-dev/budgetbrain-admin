'use client';

import { useUsersList } from '../hooks/useUsersList.hook';
import { UsersFilterBar } from '../components/UsersFilterBar.component';
import { UsersTable } from '../components/UsersTable.component';
import { ErrorState, EmptyState } from '@/shared/components/PageStates';
import { AdminTableSkeleton } from '@/shared/components/Skeleton';
import { exportRowsToCsv, type CsvColumn } from '@/shared/utils/exportToCsv';
import { usersStyles } from '../styles/users.styles';
import type { User } from '../types/users.types';

const USER_CSV_COLUMNS: CsvColumn<User>[] = [
  { key: 'name', label: 'Name', format: (u) => u.name ?? '' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'isSuspended', label: 'Status', format: (u) => (u.isSuspended ? 'Suspended' : 'Active') },
  { key: 'createdAt', label: 'Joined', format: (u) => new Date(u.createdAt).toISOString().slice(0, 10) },
];

export function UsersPage() {
  const {
    users,
    total,
    page,
    limit,
    setPage,
    search,
    setSearch,
    role,
    setRole,
    isSuspended,
    setIsSuspended,
    sortBy,
    sortDir,
    handleSort,
    error,
    loading,
    refreshing,
    reload,
  } = useUsersList();

  return (
    <div className={usersStyles.view}>
      <div className={usersStyles.header}>
        <div className={usersStyles.headerLeft}>
          <h2 className={usersStyles.title}>Users</h2>
          <p className={usersStyles.subtitle}>
            {total > 0
              ? `${total.toLocaleString()} registered accounts`
              : 'Manage all user accounts'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={usersStyles.refreshBtn}
            onClick={() => exportRowsToCsv(users, USER_CSV_COLUMNS, 'users')}
            disabled={loading || users.length === 0}
          >
            ⬇ Export CSV
          </button>
          <button
            type="button"
            className={usersStyles.refreshBtn}
            onClick={() => void reload()}
            disabled={loading || refreshing}
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <UsersFilterBar
        search={search}
        role={role}
        isSuspended={isSuspended}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onSuspendedChange={setIsSuspended}
      />

      {loading && <AdminTableSkeleton rows={8} columns={5} />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && users.length === 0 && (
        <EmptyState message="No users found." />
      )}
      {!loading && !error && users.length > 0 && (
        <UsersTable
          users={users}
          total={total}
          page={page}
          limit={limit}
          refreshing={refreshing}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default UsersPage;
