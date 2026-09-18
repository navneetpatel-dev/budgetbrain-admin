'use client';

import type { UserDetail, UserRole } from '../types/users.types';
import { ROLES } from '../hooks/useUserDetail.hook';
import { UserStatusBadge } from './UserStatusBadge.component';
import { usersStyles } from '../styles/users.styles';

interface UserActionsCardProps {
  user: UserDetail;
  role: UserRole;
  saving: boolean;
  onRoleChange: (role: UserRole) => void;
  onSaveRole: () => void;
  onToggleSuspend: () => void;
}

export function UserActionsCard({
  user,
  role,
  saving,
  onRoleChange,
  onSaveRole,
  onToggleSuspend,
}: UserActionsCardProps) {
  return (
    <div className={usersStyles.card}>
      <h3 className={usersStyles.sectionTitle}>Admin Actions</h3>
      <div className={usersStyles.formGroup}>
        <label htmlFor="role" className={usersStyles.formLabel}>Role</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            id="role"
            className={usersStyles.select}
            value={role}
            disabled={saving}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={usersStyles.btnSecondary}
            disabled={saving || role === user.role}
            onClick={onSaveRole}
          >
            {saving ? 'Saving...' : 'Update Role'}
          </button>
        </div>
      </div>

      <div className={usersStyles.formGroup}>
        <div className="flex items-center gap-2 mb-2">
          <span className={usersStyles.formLabel}>Status:</span>
          <UserStatusBadge isSuspended={user.isSuspended} />
        </div>
        <div>
          <button
            type="button"
            className={user.isSuspended ? usersStyles.btnSecondary : usersStyles.btnDanger}
            disabled={saving}
            onClick={onToggleSuspend}
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
  );
}
