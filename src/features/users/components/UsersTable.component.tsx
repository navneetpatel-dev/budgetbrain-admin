'use client';

import type { User } from '../types/users.types';
import { UserRow } from './UserRow.component';
import Pagination from '@/shared/components/Pagination';
import { usersStyles } from '../styles/users.styles';

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  onPageChange: (newPage: number) => void;
}

export function UsersTable({
  users,
  total,
  page,
  limit,
  refreshing,
  onPageChange,
}: UsersTableProps) {
  return (
    <div className={`${usersStyles.tableCard}${refreshing ? ' is-refreshing opacity-75' : ''}`}>
      <div className={usersStyles.tableWrapper}>
        <table className={usersStyles.table}>
          <thead>
            <tr>
              <th className={usersStyles.th}>Name</th>
              <th className={usersStyles.th}>Email</th>
              <th className={usersStyles.th}>Role</th>
              <th className={usersStyles.th}>Status</th>
              <th className={usersStyles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} />
    </div>
  );
}
