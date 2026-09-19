'use client';

interface SortableHeaderProps {
  label: string;
  column: string;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
  onSort: (column: string) => void;
  className?: string;
}

/** Clickable `<th>` used by admin tables with server-side sorting (Users, Support Tickets). */
export function SortableHeader({ label, column, sortBy, sortDir, onSort, className }: SortableHeaderProps) {
  const active = sortBy === column;
  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
        aria-sort={active ? (sortDir === 'ASC' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        <span className={active ? 'opacity-100' : 'opacity-30'}>
          {active && sortDir === 'DESC' ? '▼' : '▲'}
        </span>
      </button>
    </th>
  );
}
