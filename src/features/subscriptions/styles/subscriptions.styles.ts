export const subscriptionStyles = {
  view: 'flex flex-col gap-6',
  header: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40',
  headerLeft: 'flex flex-col gap-1',
  title: 'text-2xl font-black tracking-tight text-text',
  subtitle: 'text-sm text-text-secondary',
  refreshBtn: 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-surface border border-border hover:bg-surface-hover text-text transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm',
  
  // Summary bento cards
  summaryGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5',

  // Filters
  filterCard: 'bg-surface rounded-2xl border border-border-subtle shadow-sm p-4',
  formRow: 'flex flex-wrap gap-4 items-center',
  filterLabel: 'flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary',
  selectSm: 'text-xs px-2.5 py-1.5 rounded-lg border border-border bg-input-bg text-text focus:outline-none focus:ring-1 focus:ring-primary',
  inputSm: 'text-xs px-2.5 py-1.5 rounded-lg border border-border bg-input-bg text-text focus:outline-none focus:ring-1 focus:ring-primary',

  // Table
  tableCard: 'bg-surface rounded-2xl border border-border-subtle shadow-sm overflow-hidden',
  tableWrapper: 'overflow-x-auto',
  table: 'w-full text-left border-collapse text-sm',
  th: 'px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-tertiary bg-surface-low border-b border-border',
  td: 'px-4 py-3.5 border-b border-border-subtle text-text',
  tdDate: 'px-4 py-3.5 border-b border-border-subtle text-text-tertiary text-[13px] whitespace-nowrap',
  tr: 'hover:bg-surface-hover transition-colors',
  link: 'font-medium text-primary hover:underline',
  userMeta: 'text-[11px] text-text-tertiary mt-0.5',
  storeLabel: 'text-xs uppercase font-semibold text-text-secondary',
  errorBanner: 'p-3 rounded-lg bg-danger-soft border border-danger/20 text-danger text-sm font-medium',
  retryLink: 'underline font-semibold',

  // Status badges
  statusActive: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-success-soft text-success capitalize',
  statusGrace: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-warning-soft text-warning capitalize',
  statusCancelled: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-danger-soft text-danger capitalize',
  statusExpired: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-surface-high text-text-secondary capitalize',

  // Tier badges
  tierMonthly: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary-soft text-primary uppercase tracking-wider',
  tierYearly: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-violet/15 text-violet uppercase tracking-wider',
  tierLifetime: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-secondary/15 text-secondary uppercase tracking-wider font-extrabold',
} as const;
