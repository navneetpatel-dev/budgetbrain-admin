import { usersStyles } from '../styles/users.styles';

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const isAdmin = role.toLowerCase() === 'admin';
  return (
    <span className={isAdmin ? usersStyles.badgeRoleAdmin : usersStyles.badgeRole}>
      {role}
    </span>
  );
}
