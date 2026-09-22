'use client';

import { paginationStyles } from '@/shared/styles/pagination.styles';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className={paginationStyles.root}>
      <span className={paginationStyles.info}>
        {total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}
      </span>
      <div className={paginationStyles.controls}>
        <button
          type="button"
          className={paginationStyles.button}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className={paginationStyles.page}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={paginationStyles.button}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
