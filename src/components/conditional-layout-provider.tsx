'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthLayout } from '@/components/auth-layout';
import { AppLayout } from '@/components/app-layout';

const AUTH_ROUTES = ['/', '/signup', '/verify-email'];

export function ConditionalLayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <AppLayout>{children}</AppLayout>;
}
