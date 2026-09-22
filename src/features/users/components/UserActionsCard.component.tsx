'use client';

import { useState } from 'react';
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
  const [confirm, setConfirm] = useState<null | 'role' | 'suspend'>(null);

  const confirmCopy =
    confirm === 'role'
      ? {
          title: 'Update role?',
          body: `Change ${user.name ?? user.email} from ${user.role} to ${role}?`,
          action: 'Update Role',
          danger: false,
          onConfirm: onSaveRole,
        }
      : confirm === 'suspend'
        ? {
            title: user.isSuspended ? 'Reinstate user?' : 'Suspend user?',
            body: user.isSuspended
              ? `Reinstate ${user.name ?? user.email} and restore their access?`
              : `Suspend ${user.name ?? user.email}? They will not be able to sign in.`,
            action: user.isSuspended ? 'Reinstate User' : 'Suspend User',
            danger: !user.isSuspended,
            onConfirm: onToggleSuspend,
          }
        : null;

  return (
    <div className={usersStyles.card}>
      <h3 className={usersStyles.sectionTitle}>Admin Actions</h3>
      <div className={usersStyles.formGroup}>
        <label htmlFor="role" className={usersStyles.formLabel}>Role</label>
        <div className={usersStyles.roleRow}>
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
            onClick={() => setConfirm('role')}
          >
            {saving ? 'Saving...' : 'Update Role'}
          </button>
        </div>
      </div>

      <div className={usersStyles.formGroup}>
        <div className={usersStyles.statusRow}>
          <span className={usersStyles.formLabel}>Status:</span>
          <UserStatusBadge isSuspended={user.isSuspended} />
        </div>
        <div>
          <button
            type="button"
            className={user.isSuspended ? usersStyles.btnSecondary : usersStyles.btnDanger}
            disabled={saving}
            onClick={() => setConfirm('suspend')}
          >
            {saving
              ? 'Updating...'
              : user.isSuspended
                ? 'Reinstate User'
                : 'Suspend User'}
          </button>
        </div>
      </div>

      {confirmCopy && (
        <div className={usersStyles.confirmOverlay}>
          <div className={usersStyles.confirmDialog}>
            <h4 className={usersStyles.confirmTitle}>{confirmCopy.title}</h4>
            <p className={usersStyles.confirmBody}>{confirmCopy.body}</p>
            <div className={usersStyles.confirmActions}>
              <button
                type="button"
                className={usersStyles.btnSecondary}
                onClick={() => setConfirm(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className={confirmCopy.danger ? usersStyles.btnDanger : usersStyles.btnSecondary}
                disabled={saving}
                onClick={() => {
                  setConfirm(null);
                  confirmCopy.onConfirm();
                }}
              >
                {confirmCopy.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
