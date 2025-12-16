'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the main ChatClient component with SSR turned off.
// This is the new home for the logic that was causing the build error.
const ChatClient = dynamic(() => import('./client'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default function ChatLoader() {
  return <ChatClient />;
}
