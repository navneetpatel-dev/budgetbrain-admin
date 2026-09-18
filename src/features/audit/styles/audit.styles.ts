export const auditStyles = {
  view: 'flex flex-col gap-6',
  header: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40',
  headerLeft: 'flex flex-col gap-1',
  title: 'text-2xl font-black tracking-tight text-text',
  subtitle: 'text-sm text-text-secondary',
  refreshBtn: 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-surface border border-border hover:bg-surface-hover text-text transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm',
  
  filterCard: 'bg-surface rounded-2xl border border-border-subtle shadow-sm p-4',
  formRow: 'flex flex-wrap gap-4 items-center',
  filterLabel: 'flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary',
  selectSm: 'text-xs px-2.5 py-1.5 rounded-lg border border-border bg-input-bg text-text focus:outline-none focus:ring-1 focus:ring-primary',

  tableCard: 'bg-surface rounded-2xl border border-border-subtle shadow-sm overflow-hidden',
  tableWrapper: 'overflow-x-auto',
  table: 'w-full text-left border-collapse text-sm',
  th: 'px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-tertiary bg-surface-low border-b border-border',
  td: 'px-4 py-3.5 border-b border-border-subtle text-text',
  tdTime: 'px-4 py-3.5 border-b border-border-subtle text-text-tertiary text-xs whitespace-nowrap',
  tr: 'hover:bg-surface-hover transition-colors',
  link: 'font-medium text-primary hover:underline cursor-pointer text-xs',
  codeAction: 'px-1.5 py-0.5 rounded bg-surface-high font-mono text-xs text-text border border-border-subtle',
  actorBlock: 'flex flex-col',
  actorPrimary: 'text-text font-medium text-xs',
  actorSecondary: 'text-[11px] text-text-tertiary',

  // Source badges
  sourceMobile: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-soft text-primary capitalize',
  sourceWeb: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-ocean/15 text-ocean capitalize',
  sourceAdmin: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet/15 text-violet uppercase tracking-wider',
  sourceSystem: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-high text-text-secondary capitalize',

  // Outcome badges
  outcomeSuccess: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-success-soft text-success capitalize',
  outcomeFailure: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-danger-soft text-danger capitalize',

  // Severity badges
  severityInfo: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-high text-text-secondary capitalize',
  severityWarning: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-warning-soft text-warning capitalize',
  severityCritical: 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-danger-soft text-danger capitalize',

  // Details row
  detailsRow: 'bg-surface-low border-b border-border',
  detailsContainer: 'p-4 flex flex-col gap-3 text-xs',
  detailsMetaRow: 'flex flex-wrap gap-6 text-text-secondary',
  detailsMetaItem: 'flex items-center gap-1.5',
  detailsMetaLabel: 'font-bold text-text',
  jsonBlock: 'flex flex-col gap-1',
  jsonLabel: 'font-bold text-text-secondary uppercase text-[10px]',
  jsonPre: 'p-3 rounded-lg bg-surface border border-border text-text font-mono text-xs overflow-x-auto max-h-60',
} as const;
