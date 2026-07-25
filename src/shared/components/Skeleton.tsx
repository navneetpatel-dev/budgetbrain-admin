import type { CSSProperties, ReactNode } from 'react';

/* ── Skeleton Block ── */

function SkeletonBlock({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: 'var(--surface-hover)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(105deg, transparent 30%, var(--primary-soft) 50%, transparent 70%)',
          animation: 'admin-shimmer 1.4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function SurfaceCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className ? `card ${className}` : 'card'}
      style={{
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Page-Level Skeletons ── */

/** Dashboard/KPI cards — matches `.grid` + `.stat` layout. Title stays on the page. */
export function AdminDashboardSkeleton({ cards = 12 }: { cards?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: cards }).map((_, i) => (
        <SurfaceCard key={i} className="stat" style={{ minHeight: 88, textAlign: 'center' }}>
          <SkeletonBlock width="48%" height={28} radius={8} style={{ margin: '0 auto 10px' }} />
          <SkeletonBlock width="62%" height={13} radius={6} style={{ margin: '0 auto' }} />
        </SurfaceCard>
      ))}
    </div>
  );
}

/** Table/list skeleton — matches card + table chrome. Title stays on the page. */
export function AdminTableSkeleton({
  rows = 8,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  const widths = ['20%', '26%', '14%', '14%', '16%', '12%', '12%', '10%'];
  return (
    <div>
      <SurfaceCard style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            gap: 16,
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--surface-hover)',
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonBlock key={i} width={widths[i % widths.length]} height={12} radius={5} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 16px',
              borderBottom: row < rows - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            {Array.from({ length: columns }).map((_, col) => (
              <SkeletonBlock
                key={col}
                width={widths[col % widths.length]}
                height={13}
                radius={5}
              />
            ))}
          </div>
        ))}
      </SurfaceCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <SkeletonBlock width={120} height={13} radius={5} />
        <div style={{ display: 'flex', gap: 8 }}>
          <SkeletonBlock width={36} height={32} radius={8} />
          <SkeletonBlock width={36} height={32} radius={8} />
        </div>
      </div>
    </div>
  );
}

/** Detail page: profile grid + action panel */
export function AdminDetailSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <SkeletonBlock width={120} height={14} radius={6} style={{ marginBottom: 12 }} />
        <SkeletonBlock width={220} height={28} radius={8} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <SurfaceCard>
          <SkeletonBlock width={90} height={16} radius={6} style={{ marginBottom: 18 }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <SkeletonBlock width="28%" height={12} radius={5} />
              <SkeletonBlock width="42%" height={13} radius={5} />
            </div>
          ))}
        </SurfaceCard>
        <SurfaceCard>
          <SkeletonBlock width={120} height={16} radius={6} style={{ marginBottom: 18 }} />
          <SkeletonBlock width="100%" height={40} radius={10} style={{ marginBottom: 12 }} />
          <SkeletonBlock width={140} height={36} radius={8} style={{ marginBottom: 24 }} />
          <SkeletonBlock width="40%" height={13} radius={5} style={{ marginBottom: 12 }} />
          <SkeletonBlock width={160} height={36} radius={8} />
        </SurfaceCard>
      </div>
    </div>
  );
}

/** Login page skeleton */
export function AdminLoginSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 32,
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <SkeletonBlock width={48} height={48} radius={14} style={{ marginBottom: 16 }} />
        <SkeletonBlock width={180} height={28} radius={8} style={{ marginBottom: 8 }} />
        <SkeletonBlock width={240} height={14} radius={6} style={{ marginBottom: 32 }} />
        <SkeletonBlock width="100%" height={50} radius={12} style={{ marginBottom: 12 }} />
        <SkeletonBlock width="100%" height={50} radius={12} style={{ marginBottom: 24 }} />
        <SkeletonBlock width="100%" height={48} radius={12} />
      </div>
    </div>
  );
}
