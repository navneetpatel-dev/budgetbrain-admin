'use client';

import { memo } from 'react';
import Pagination from '@/shared/components/Pagination.component';
import { CATALOG_COLUMNS, cellText } from '../utils/templateMapping';
import { CatalogStatusBadge } from './CatalogStatusBadge.component';
import { detectionStyles } from '../styles/detection.styles';
import type { CatalogEntity, CatalogRow } from '../types/detection.types';

interface CatalogTableProps {
  entity: CatalogEntity;
  items: CatalogRow[];
  total: number;
  page: number;
  limit: number;
  refreshing: boolean;
  selectedId: string | null;
  onSelect: (row: CatalogRow) => void;
  onPageChange: (page: number) => void;
}

const CatalogTableRow = memo(function CatalogTableRow({
  row,
  columns,
  selected,
  onSelect,
}: {
  row: CatalogRow;
  columns: string[];
  selected: boolean;
  onSelect: (row: CatalogRow) => void;
}) {
  return (
    <tr className={`${detectionStyles.tr} ${selected ? detectionStyles.trSelected : ''}`}>
      <td className={detectionStyles.td}>
        <button type="button" className={detectionStyles.link} onClick={() => onSelect(row)}>
          <span className={detectionStyles.mono}>{row.id}</span>
        </button>
      </td>
      {columns.map((column) => (
        <td key={column} className={detectionStyles.tdMuted}>
          {cellText(row[column])}
        </td>
      ))}
      <td className={detectionStyles.td}>
        <CatalogStatusBadge status={row.status} />
      </td>
      <td className={detectionStyles.tdNum}>v{row.version}</td>
      <td className={detectionStyles.tdMuted}>{row.source ?? '—'}</td>
    </tr>
  );
});

export function CatalogTable({ entity, items, total, page, limit, refreshing, selectedId, onSelect, onPageChange }: CatalogTableProps) {
  const columns = CATALOG_COLUMNS[entity];
  return (
    <div className={`${detectionStyles.tableCard}${refreshing ? ' opacity-75' : ''}`}>
      <div className={detectionStyles.tableWrapper}>
        <table className={detectionStyles.table}>
          <thead>
            <tr>
              <th className={detectionStyles.th}>Id</th>
              {columns.map((column) => (
                <th key={column} className={detectionStyles.th}>
                  {column}
                </th>
              ))}
              <th className={detectionStyles.th}>Status</th>
              <th className={detectionStyles.thNum}>Version</th>
              <th className={detectionStyles.th}>Source</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <CatalogTableRow key={row.id} row={row} columns={columns} selected={row.id === selectedId} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} limit={limit} total={total} onPageChange={onPageChange} />
    </div>
  );
}
