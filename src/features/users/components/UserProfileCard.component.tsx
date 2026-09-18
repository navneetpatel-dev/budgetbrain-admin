import type { UserDetail } from '../types/users.types';
import { usersStyles } from '../styles/users.styles';

interface UserProfileCardProps {
  user: UserDetail;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className={usersStyles.card}>
      <h3 className={usersStyles.sectionTitle}>Profile</h3>
      <dl className={usersStyles.dl}>
        <dt className={usersStyles.dt}>Email</dt>
        <dd className={usersStyles.dd}>{user.email}</dd>
        <dt className={usersStyles.dt}>Name</dt>
        <dd className={usersStyles.dd}>{user.name ?? '—'}</dd>
        <dt className={usersStyles.dt}>Country</dt>
        <dd className={usersStyles.dd}>{user.country ?? '—'}</dd>
        <dt className={usersStyles.dt}>Currency</dt>
        <dd className={usersStyles.dd}>{user.currency}</dd>
        <dt className={usersStyles.dt}>Email Verified</dt>
        <dd className={usersStyles.dd}>{user.emailVerified ? 'Yes' : 'No'}</dd>
        <dt className={usersStyles.dt}>Onboarding</dt>
        <dd className={usersStyles.dd}>{user.onboardingCompleted ? 'Complete' : 'Incomplete'}</dd>
        <dt className={usersStyles.dt}>Last Login</dt>
        <dd className={usersStyles.dd}>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}</dd>
        <dt className={usersStyles.dt}>Joined</dt>
        <dd className={usersStyles.dd}>{new Date(user.createdAt).toLocaleDateString()}</dd>
      </dl>
    </div>
  );
}
