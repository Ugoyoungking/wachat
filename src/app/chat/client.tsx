'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { chats, currentUser, type Chat } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Lock, MoreVertical, Paperclip, Search, Send } from 'lucide-react';

export default function ChatClient() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);

  const otherUser = selectedChat.users.find((u) => u.id !== currentUser.id);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Card className="h-full">
        <CardContent className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr] p-0">
          <div className="flex flex-col border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-9" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {chats.map((chat) => {
                  const user = chat.users.find((u) => u.id !== currentUser.id);
                  if (!user) return null;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent/50',
                        selectedChat.id === chat.id && 'bg-accent'
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.messages[chat.messages.length - 1].text}
                        </p>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {chat.messages[chat.messages.length - 1].timestamp}
                      </time>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col h-full">
            {otherUser && (
              <>
                <div className="flex items-center gap-4 border-b p-4">
                  <Avatar>
                    <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{otherUser.name}</p>
                    <p className="text-xs text-muted-foreground">{otherUser.lastSeen}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs">E2EE</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex max-w-[75%] gap-2',
                          message.senderId === currentUser.id ? 'ml-auto flex-row-reverse' : ''
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={selectedChat.users.find((u) => u.id === message.senderId)?.avatar}
                          />
                          <AvatarFallback>
                            {selectedChat.users.find((u) => u.id === message.senderId)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm',
                            message.senderId === currentUser.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-start gap-4 border-t p-4">
                  <Textarea placeholder="Type a message..." className="min-h-0 flex-1 resize-none" rows={1} />
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="bg-accent hover:bg-accent/90">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
