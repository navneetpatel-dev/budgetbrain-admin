'use client';

import type { AiConversation } from '../types/ai.types';
import { AiConversationRow } from './AiConversationRow.component';
import Pagination from '@/shared/components/Pagination';
import { aiStyles } from '../styles/ai.styles';

interface AiUsageTableProps {
  conversations: AiConversation[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  onPageChange: (newPage: number) => void;
}

export function AiUsageTable({
  conversations,
  total,
  page,
  limit,
  refreshing,
  onPageChange,
}: AiUsageTableProps) {
  return (
    <div className={`${aiStyles.tableCard}${refreshing ? ' is-refreshing opacity-75' : ''}`}>
      <div className={aiStyles.tableWrapper}>
        <table className={aiStyles.table}>
          <thead>
            <tr>
              <th className={aiStyles.th}>User</th>
              <th className={aiStyles.th}>Conversation Title</th>
              <th className={aiStyles.th}>Messages</th>
              <th className={aiStyles.th}>Created</th>
              <th className={aiStyles.th}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((c) => (
              <AiConversationRow key={c.id} conversation={c} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} />
    </div>
  );
}
