'use client';

import { usersStyles } from '../styles/users.styles';

interface UsersFilterBarProps {
  search: string;
  role: string;
  isSuspended: 'all' | 'true' | 'false';
  onSearchChange: (search: string) => void;
  onRoleChange: (role: string) => void;
  onSuspendedChange: (status: 'all' | 'true' | 'false') => void;
}

export function UsersFilterBar({
  search,
  role,
  isSuspended,
  onSearchChange,
  onRoleChange,
  onSuspendedChange,
}: UsersFilterBarProps) {
  return (
    <div className={usersStyles.filterCard}>
      <div className={usersStyles.formRow}>
        <label className={usersStyles.filterLabel}>
          <span>Search</span>
          <input
            type="text"
            className={usersStyles.inputSm}
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <label className={usersStyles.filterLabel}>
          <span>Role</span>
          <select
            className={usersStyles.selectSm}
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="lifetime">Lifetime</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className={usersStyles.filterLabel}>
          <span>Status</span>
          <select
            className={usersStyles.selectSm}
            value={isSuspended}
            onChange={(e) => onSuspendedChange(e.target.value as 'all' | 'true' | 'false')}
          >
            <option value="all">All Statuses</option>
            <option value="false">Active</option>
            <option value="true">Suspended</option>
          </select>
        </label>
      </div>
    </div>
  );
}
