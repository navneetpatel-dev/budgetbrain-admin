'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '@/features/auth';

export default function Page() {
  const router = useRouter();
  return <LoginPage onLogin={() => router.replace('/')} />;
}
