'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { detectionStyles } from '../styles/detection.styles';

const TABS = [
  { href: '/detection', label: 'Overview' },
  { href: '/detection/catalog', label: 'Catalog' },
  { href: '/detection/kill-switches', label: 'Kill switches' },
  { href: '/detection/learning', label: 'Learning queues' },
  { href: '/detection/deletions', label: 'Deletions' },
];

export function DetectionTabs() {
  const pathname = usePathname();
  return (
    <nav className={detectionStyles.tabs} aria-label="Detection sections">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} className={pathname === tab.href ? detectionStyles.tabActive : detectionStyles.tab}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
