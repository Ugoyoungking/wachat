'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthLayout } from '@/components/auth-layout';
import { AppLayout } from '@/components/app-layout';

const AUTH_ROUTES = ['/login', '/signup', '/verify-email'];
const APP_LAYOUT_ROUTES = [
  '/chat',
  '/settings',
  '/custom-ai',
  '/wachat-ai',
  '/add',
  '/link',
  // Routes from new design that can be implemented later
  '/status',
  '/channels',
  '/community',
  '/archived',
  '/favorites',
];

const PUBLIC_PAGES = ['/']; // Add public pages here

export function ConditionalLayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (
    PUBLIC_PAGES.includes(pathname) ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/faq')
  ) {
    return <>{children}</>;
  }

  if (AUTH_ROUTES.includes(pathname)) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  // Check if the current path starts with any of the app layout routes
  if (APP_LAYOUT_ROUTES.some(route => pathname.startsWith(route))) {
    return <AppLayout>{children}</AppLayout>;
  }

  // Fallback for any other route, can be a 404 or a default layout
  return <>{children}</>;
}
