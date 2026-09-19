import { usersStyles } from '../styles/users.styles';

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const normalized = role.toLowerCase();
  let badgeClass: string = usersStyles.badgeRole;
  if (normalized === 'admin') {
    badgeClass = usersStyles.badgeRoleAdmin;
  } else if (normalized === 'premium' || normalized === 'pro') {
    badgeClass = usersStyles.badgeRolePro;
  } else if (normalized === 'lifetime') {
    badgeClass = usersStyles.badgeRoleLifetime;
  }
  return (
    <span className={badgeClass}>
      {role}
    </span>
  );
}
