'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn, logout, verifyAdminSession } from '@/shared/services/api';
import { BrandMark } from '@/shared/components/BrandMark';
import { AdminLoginSkeleton } from '@/shared/components/Skeleton';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', exact: true },
  { href: '/users', label: 'Users', exact: false },
  { href: '/subscriptions', label: 'Subscriptions', exact: false },
  { href: '/ai-usage', label: 'AI Usage', exact: false },
  { href: '/support-tickets', label: 'Support', exact: false },
  { href: '/audit-logs', label: 'Audit Logs', exact: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    verifyAdminSession().then((valid) => {
      if (valid) {
        setAuthorized(true);
      } else {
        router.replace('/login');
      }
      setChecking(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (checking || !authorized) {
    return <AdminLoginSkeleton />;
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark size={36} showBackground={false} />
          <div className="brand-text">
            <h1>
              Budget<span>Brain</span>
            </h1>
            <p>Admin Portal</p>
          </div>
        </div>
        <nav>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
