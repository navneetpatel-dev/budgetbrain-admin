import type { Metadata } from 'next';
import './globals.css';
import '../styles.css';

export const metadata: Metadata = {
  title: 'BudgetBrain Admin Portal',
  description: 'Internal admin dashboard for BudgetBrain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
