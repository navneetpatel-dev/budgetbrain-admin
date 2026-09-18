import Link from 'next/link';
import type { User } from '../types/users.types';
import { UserStatusBadge } from './UserStatusBadge.component';
import { UserRoleBadge } from './UserRoleBadge.component';
import { usersStyles } from '../styles/users.styles';

interface UserRowProps {
  user: User;
}

export function UserRow({ user }: UserRowProps) {
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className={usersStyles.tr}>
      <td className={usersStyles.td}>
        <Link href={`/users/${user.id}`} className={usersStyles.link}>
          {user.name ?? '—'}
        </Link>
      </td>
      <td className={usersStyles.tdMuted}>{user.email}</td>
      <td className={usersStyles.td}>
        <UserRoleBadge role={user.role} />
      </td>
      <td className={usersStyles.td}>
        <UserStatusBadge isSuspended={user.isSuspended} />
      </td>
      <td className={usersStyles.tdDate}>{joinedDate}</td>
    </tr>
  );
}
