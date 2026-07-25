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
          background: 'linear-gradient(105deg, transparent 30%, var(--primary-soft) 50%, transparent 70%)',
          animation: 'admin-shimmer 1.4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function SkeletonCircle({ size = 32, style }: { size?: number; style?: CSSProperties }) {
  return <SkeletonBlock width={size} height={size} radius={size / 2} style={style} />;
}

function SurfaceCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="card"
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

function SkeletonHeader() {
  return (
    <div style={{ marginBottom: 24 }}>
      <SkeletonBlock width={200} height={28} radius={8} />
      <SkeletonBlock width={160} height={14} radius={6} style={{ marginTop: 10 }} />
    </div>
  );
}

/** Dashboard: KPI cards with label + value shape */
export function AdminDashboardSkeleton({ cards = 12 }: { cards?: number }) {
  return (
    <div>
      <SkeletonHeader />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {Array.from({ length: cards }).map((_, i) => (
          <SurfaceCard key={i} style={{ minHeight: 100 }}>
            <SkeletonBlock width="55%" height={28} radius={8} style={{ marginBottom: 12 }} />
            <SkeletonBlock width="70%" height={13} radius={6} />
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}

/** Table/list skeleton with column-shaped rows */
export function AdminTableSkeleton({
  rows = 8,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  const widths = ['22%', '28%', '14%', '14%', '16%'];
  return (
    <div>
      <SkeletonHeader />
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
            {Array.from({ length: columns }).map((_, col) =>
              col === 0 ? (
                <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 10, width: widths[0] }}>
                  <SkeletonCircle size={28} />
                  <SkeletonBlock width="70%" height={13} radius={5} />
                </div>
              ) : col === columns - 2 ? (
                <SkeletonBlock key={col} width={64} height={22} radius={999} style={{ width: widths[col % widths.length] }} />
              ) : (
                <SkeletonBlock key={col} width={widths[col % widths.length]} height={13} radius={5} />
              )
            )}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
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
