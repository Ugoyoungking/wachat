
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthLayout } from '@/components/auth-layout';
import { AppLayout } from '@/components/app-layout';

const AUTH_ROUTES = ['/login', '/signup', '/verify-email', '/add'];
const PUBLIC_PAGES = ['/']; // Add public pages here

export function ConditionalLayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_PAGES.includes(pathname) || pathname.startsWith('/about') || pathname.startsWith('/privacy') || pathname.startsWith('/terms') || pathname.startsWith('/faq')) {
    return <>{children}</>;
  }

  if (AUTH_ROUTES.includes(pathname)) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <AppLayout>{children}</AppLayout>;
}
