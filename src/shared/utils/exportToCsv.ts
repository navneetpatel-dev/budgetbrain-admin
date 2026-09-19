export interface CsvColumn<T> {
  key: keyof T | string;
  label: string;
  /** Optional formatter; defaults to String(value ?? ''). */
  format?: (row: T) => string;
}

function getCellValue<T>(row: T, column: CsvColumn<T>): string {
  if (column.format) return column.format(row);
  const value = (row as Record<string, unknown>)[column.key as string];
  if (value === null || value === undefined) return '';
  return String(value);
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCsvCell(c.label)).join(',');
  const body = rows
    .map((row) => columns.map((c) => escapeCsvCell(getCellValue(row, c))).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

/** Builds a CSV from the given rows/columns and triggers a browser download. */
export function exportRowsToCsv<T>(rows: T[], columns: CsvColumn<T>[], filename: string): void {
  const csv = buildCsv(rows, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
