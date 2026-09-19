'use client';

import { useEffect, useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource';
import { getUserById, updateUserRole, updateUserSuspension } from '../api/users.api';
import type { UserDetail, UserRole } from '../types/users.types';

export const ROLES: UserRole[] = ['free', 'premium', 'lifetime', 'admin'];

export function toEditableRole(role: string): UserRole {
  if (role === 'admin' || role === 'premium' || role === 'lifetime') {
    return role;
  }
  return 'free';
}

export function useUserDetail(id?: string) {
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole>('free');

  const { data: user, error, loading, refreshing, reload, setData } = useCachedResource<UserDetail>(
    id ? `user:${id}` : 'user:invalid',
    async () => {
      if (!id) throw new Error('Invalid user ID');
      return getUserById(id);
    }
  );

  useEffect(() => {
    if (user) {
      setRole(toEditableRole(user.role));
    }
  }, [user]);

  const saveRole = async () => {
    if (!id) return;
    setSaving(true);
    setActionError('');
    try {
      const updated = await updateUserRole(id, role);
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
      const updated = await updateUserSuspension(id, !user.isSuspended);
      setData(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update suspension');
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    error,
    loading,
    refreshing,
    reload,
    role,
    setRole,
    saving,
    actionError,
    saveRole,
    toggleSuspend,
  };
}
