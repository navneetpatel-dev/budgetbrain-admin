'use client';

import Link from 'next/link';
import type { AiConversation } from '../types/ai.types';
import { aiStyles } from '../styles/ai.styles';

interface AiConversationRowProps {
  conversation: AiConversation;
}

export function AiConversationRow({ conversation: c }: AiConversationRowProps) {
  const createdDate = new Date(c.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const updatedDate = new Date(c.updatedAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className={aiStyles.tr}>
      <td className={aiStyles.td}>
        <Link href={`/users/${c.userId}`} className={aiStyles.link}>
          {c.user?.email ?? c.userId.slice(0, 8)}
        </Link>
        {c.user?.name && (
          <div className="text-[11px] text-text-tertiary mt-0.5">{c.user.name}</div>
        )}
      </td>
      <td className="max-w-[300px] px-4 py-3.5 border-b border-border-subtle">
        <span className="block font-medium text-text truncate">
          {c.title}
        </span>
      </td>
      <td className={aiStyles.td}>
        <span className={aiStyles.badgeSecondary}>{c.messageCount}</span>
      </td>
      <td className={aiStyles.tdDate}>{createdDate}</td>
      <td className={aiStyles.tdDate}>{updatedDate}</td>
    </tr>
  );
}
