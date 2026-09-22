'use client';

import type { User } from '../types/users.types';
import { UserRow } from './UserRow.component';
import Pagination from '@/shared/components/Pagination.component';
import { SortableHeader } from '@/shared/components/SortableHeader.component';
import { usersStyles } from '../styles/users.styles';

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
  onSort: (column: string) => void;
  onPageChange: (newPage: number) => void;
}

export function UsersTable({
  users,
  total,
  page,
  limit,
  refreshing,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
}: UsersTableProps) {
  return (
    <div className={`${usersStyles.tableCard}${refreshing ? ' is-refreshing opacity-75' : ''}`}>
      <div className={usersStyles.tableWrapper}>
        <table className={usersStyles.table}>
          <thead>
            <tr>
              <th className={usersStyles.th}>Name</th>
              <SortableHeader label="Email" column="email" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={usersStyles.th} />
              <SortableHeader label="Role" column="role" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={usersStyles.th} />
              <SortableHeader label="Status" column="isSuspended" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={usersStyles.th} />
              <SortableHeader label="Joined" column="createdAt" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className={usersStyles.th} />
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
