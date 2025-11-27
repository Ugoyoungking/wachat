'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { chats as initialChats, currentUser, type Chat, type Message } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Lock, MoreVertical, Paperclip, Search, Send } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ChatClient() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string>(initialChats[0].id);
  const [message, setMessage] = useState('');

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const otherUser = selectedChat?.users.find((u) => u.id !== currentUser.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !selectedChat) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const userAvatar = (userId: string) => {
    const user = selectedChat?.users.find((u) => u.id === userId);
    if (!user) return null;
    const avatar = PlaceHolderImages.find((p) => p.id === user.avatar.split('/').pop()?.split('?')[0]);
    return avatar?.imageUrl || user.avatar;
  }

  const getAvatarFallback = (userId: string) => {
    const user = selectedChat?.users.find((u) => u.id === userId);
    if (!user) return 'U';
    return user.name.charAt(0);
  }

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
                      onClick={() => setSelectedChatId(chat.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent/50',
                        selectedChat?.id === chat.id && 'bg-accent'
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={userAvatar(user.id)} alt={user.name} />
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
            {otherUser && selectedChat && (
              <>
                <div className="flex items-center gap-4 border-b p-4">
                  <Avatar>
                    <AvatarImage src={userAvatar(otherUser.id)} alt={otherUser.name} />
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
                            src={userAvatar(message.senderId)}
                          />
                          <AvatarFallback>
                           {getAvatarFallback(message.senderId)}
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
                <form onSubmit={handleSendMessage} className="flex items-start gap-4 border-t p-4">
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-0 flex-1 resize-none"
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button variant="ghost" size="icon" type="button">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={!message.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
