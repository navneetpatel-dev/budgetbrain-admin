'use client';

import Link from 'next/link';
import { useParams } from 'react-router-dom';
import { useUserDetail } from '../hooks/useUserDetail.hook';
import { UserProfileCard } from '../components/UserProfileCard.component';
import { UserActionsCard } from '../components/UserActionsCard.component';
import { UserRoleBadge } from '../components/UserRoleBadge.component';
import { UserStatusBadge } from '../components/UserStatusBadge.component';
import { ErrorState } from '@/shared/components/PageStates';
import { AdminDetailSkeleton } from '@/shared/components/Skeleton';
import { usersStyles } from '../styles/users.styles';

interface UserDetailPageProps {
  id?: string;
}

export function UserDetailPage({ id: propId }: UserDetailPageProps = {}) {
  let routeParams: { id?: string } = {};
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routeParams = useParams<{ id: string }>();
  } catch {
    routeParams = {};
  }
  const id = propId ?? routeParams?.id;

  const {
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
  } = useUserDetail(id);

  if (!id) return <ErrorState message="Invalid user ID" />;

  return (
    <div className={usersStyles.view}>
      {loading && <AdminDetailSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && user && (
        <>
          <div className={usersStyles.header}>
            <div className={usersStyles.headerLeft}>
              <Link href="/users" className={usersStyles.backLink}>
                ← Back to Users
              </Link>
              <h2 className={usersStyles.title}>{user.name ?? user.email}</h2>
              <div className={usersStyles.subtitle}>
                <UserRoleBadge role={user.role} />
                <UserStatusBadge isSuspended={user.isSuspended} />
              </div>
            </div>
            <button
              type="button"
              className={usersStyles.refreshBtn}
              onClick={() => void reload()}
              disabled={loading || refreshing}
            >
              {refreshing ? 'Refreshing…' : '↻ Refresh'}
            </button>
          </div>

          {actionError && <div className={usersStyles.errorBanner}>{actionError}</div>}

          <div className={`${usersStyles.detailGrid}${refreshing ? ' opacity-75' : ''}`}>
            <UserProfileCard user={user} />
            <UserActionsCard
              user={user}
              role={role}
              saving={saving}
              onRoleChange={setRole}
              onSaveRole={saveRole}
              onToggleSuspend={toggleSuspend}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default UserDetailPage;
