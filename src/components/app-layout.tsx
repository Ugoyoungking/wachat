'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  Circle,
  Users,
  Archive,
  Star,
  Menu,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useUser } from '@/firebase';
import { signOut } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing out',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };
  
  const navTopItems = [
    { href: '/chat', icon: MessageSquare, label: 'Chats' },
    { href: '/status', icon: Circle, label: 'Status' },
    { href: '/channels', icon: Users, label: 'Channels' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/wachat-ai', icon: Bot, label: 'WaChat AI'},
    { href: '/custom-ai', icon: Sparkles, label: 'Custom AI'},
    { href: '/archived', icon: Archive, label: 'Archived' },
    { href: '/favorites', icon: Star, label: 'Favorites'},
  ];

  const navBottomItems = [
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-sidebar-panel-background">
        {/* Narrow Sidebar */}
        <aside className="flex h-full flex-col items-center justify-between border-r border-sidebar-border bg-sidebar-rail-background p-2">
          <nav className="flex flex-col items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navTopItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-10 w-10"
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-4">
             {navBottomItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-10 w-10"
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Avatar className="h-9 w-9 cursor-pointer">
                  {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuLabel>{user?.displayName || 'Welcome'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => router.push('/settings')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-screen flex">{children}</main>
      </div>
    </TooltipProvider>
  );
}
