'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { SupportTicket, TicketStatus } from '../types/support.types';
import { STATUSES, STATUS_LABEL } from '../types/support.types';
import { TicketStatusBadge } from './TicketStatusBadge.component';
import { TicketPriorityBadge } from './TicketPriorityBadge.component';
import { supportStyles } from '../styles/support.styles';

interface TicketRowProps {
  ticket: SupportTicket;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: TicketStatus) => void;
}

export const TicketRow = memo(function TicketRow({ ticket: t, updatingId, onUpdateStatus }: TicketRowProps) {
  const createdDate = new Date(t.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className={supportStyles.tr}>
      <td className={supportStyles.td}>
        <Link href={`/users/${t.userId}`} className={supportStyles.link}>
          {t.user?.email ?? t.userId.slice(0, 8)}
        </Link>
        {t.user?.name && (
          <div className={supportStyles.userMeta}>{t.user.name}</div>
        )}
      </td>
      <td className={supportStyles.td}>
        <div className={supportStyles.ticketSubject}>{t.subject}</div>
        <div className={supportStyles.ticketMessage}>
          {t.message.slice(0, 80)}
          {t.message.length > 80 ? '…' : ''}
        </div>
      </td>
      <td className={supportStyles.td}>
        <TicketPriorityBadge priority={t.priority} />
      </td>
      <td className={supportStyles.td}>
        <div className={supportStyles.statusActions}>
          <TicketStatusBadge status={t.status} />
          <select
            className={supportStyles.selectSm}
            value={t.status}
            disabled={updatingId === t.id}
            onChange={(e) => onUpdateStatus(t.id, e.target.value as TicketStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className={supportStyles.tdDate}>{createdDate}</td>
    </tr>
  );
});
