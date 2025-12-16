import MemoryGame from '@/components/memory-game';
import './offline.css';
import { Logo } from '@/components/logo';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <div className="mb-8">
        <Logo className="h-16 w-16 mx-auto" />
      </div>
      <h1 className="text-4xl font-bold mb-2">You're Offline</h1>
      <p className="text-muted-foreground mb-8">
        It seems you've lost your connection. But don't worry, you can play a game while you wait!
      </p>
      
      <MemoryGame />

      <p className="mt-8 text-sm text-muted-foreground">
        Your WaChat app will automatically reconnect when you're back online.
      </p>
    </div>
  );
}
