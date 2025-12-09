
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ChatClient = dynamic(() => import('./client'), {
  ssr: false,
  loading: () => <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});

export default function ChatPage() {
  return <ChatClient />;
}
