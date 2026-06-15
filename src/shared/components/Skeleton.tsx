import type { CSSProperties } from 'react';

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
          background: 'linear-gradient(90deg, transparent 0%, var(--primary-soft) 50%, transparent 100%)',
          animation: 'admin-shimmer 1.5s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ── Page-Level Skeletons ── */

function SkeletonHeader() {
  return (
    <div style={{ marginBottom: '24px' }}>
      <SkeletonBlock width={200} height={28} radius={6} />
      <SkeletonBlock width={140} height={16} radius={6} style={{ marginTop: 8 }} />
    </div>
  );
}

/** Dashboard: 12 KPI stat cards */
export function AdminDashboardSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonBlock key={i} height={100} radius={12} />
        ))}
      </div>
    </div>
  );
}

/** Table/list skeleton: header + rows */
export function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div>
      <SkeletonHeader />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonBlock height={40} radius={8} />
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBlock key={i} height={52} radius={8} />
        ))}
      </div>
    </div>
  );
}

/** Detail page skeleton */
export function AdminDetailSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <SkeletonBlock height={200} radius={12} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 10 }}>
        <SkeletonBlock width={140} height={40} radius={8} />
        <SkeletonBlock width={120} height={40} radius={8} />
      </div>
    </div>
  );
}

/** Login page skeleton */
export function AdminLoginSkeleton() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 32 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <SkeletonBlock width={48} height={48} radius={14} style={{ marginBottom: 16 }} />
        <SkeletonBlock width={180} height={28} radius={6} style={{ marginBottom: 8 }} />
        <SkeletonBlock width={240} height={16} radius={6} style={{ marginBottom: 32 }} />
        <SkeletonBlock width="100%" height={50} radius={12} style={{ marginBottom: 12 }} />
        <SkeletonBlock width="100%" height={50} radius={12} style={{ marginBottom: 24 }} />
        <SkeletonBlock width="100%" height={48} radius={12} />
      </div>
    </div>
  );
}
