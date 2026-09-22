'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn, verifyAdminSession } from '@/shared/api/admin.api';
import { AdminLoginSkeleton } from '@/shared/components/Skeleton.component';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/');
      return;
    }
    verifyAdminSession().then((valid) => {
      if (valid) {
        router.replace('/');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) return <AdminLoginSkeleton />;

  return <>{children}</>;
}
