'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bot, ChevronDown, MessageSquare, Settings, Sparkles, LogOut } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { signOut } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isChatsOpen, setIsChatsOpen] = useState(pathname.startsWith('/chat'));
  const [isAiFeaturesOpen, setIsAiFeaturesOpen] = useState(pathname.startsWith('/wachat-ai') || pathname.startsWith('/custom-ai'));


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

  const chatNavItems = [
    { href: '/chat', icon: <MessageSquare />, label: 'Chats' },
  ];

  const aiFeaturesNavItems = [
    { href: '/wachat-ai', icon: <Bot />, label: 'WaChat AI' },
    { href: '/custom-ai', icon: <Sparkles />, label: 'Custom AI' },
  ];
  
  const bottomNavItems = [
    { href: '/settings', icon: <Settings />, label: 'Settings' },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo />
            <h1 className="text-xl font-semibold">WaChat</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem asChild>
              <Collapsible open={isChatsOpen} onOpenChange={setIsChatsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare/>
                      <span>Chats</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isChatsOpen && 'rotate-180'
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                  <SidebarMenu className="pl-4 pt-2">
                    {chatNavItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                          <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                            <span>
                              {item.icon}
                              <span>{item.label}</span>
                            </span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            <SidebarMenuItem asChild>
              <Collapsible open={isAiFeaturesOpen} onOpenChange={setIsAiFeaturesOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles/>
                        <span>AI Features</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isAiFeaturesOpen && 'rotate-180'
                        )}
                      />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                  <SidebarMenu className="pl-4 pt-2">
                  {aiFeaturesNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href}>
                        <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                          <span>
                            {item.icon}
                            <span>{item.label}</span>
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
            
            {bottomNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                    <span>
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.displayName || 'Welcome'}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="h-full p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
