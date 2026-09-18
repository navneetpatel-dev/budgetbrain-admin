import { usersStyles } from '../styles/users.styles';

interface UserStatusBadgeProps {
  isSuspended?: boolean;
}

export function UserStatusBadge({ isSuspended }: UserStatusBadgeProps) {
  if (isSuspended) {
    return <span className={usersStyles.badgeSuspended}>Suspended</span>;
  }
  return <span className={usersStyles.badgeActive}>Active</span>;
}
