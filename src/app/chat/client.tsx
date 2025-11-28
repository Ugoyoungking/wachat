
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, where, getDocs, limit } from 'firebase/firestore';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { type Chat, type Message, type User as UserType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Lock, MoreVertical, Paperclip, Search, Send, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ChatClient() {
  const { user: currentUser, isLoading: isLoadingUser } = useUser();
  const firestore = useFirestore();

  // Query for existing chats
  const chatsQuery = currentUser
    ? query(collection(firestore, 'chats'), where('userIds', 'array-contains', currentUser.uid))
    : null;
  const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
  
  // Query for all users to display in the contacts list, only run when user is loaded
  const usersQuery = !isLoadingUser && currentUser ? query(collection(firestore, 'users')) : null;
  const { data: allUsers, isLoading: isLoadingUsersList } = useCollection<UserType>(usersQuery);


  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // When a user is selected from the list
  const handleSelectUser = async (user: UserType) => {
    if (!currentUser) return;
    
    // Check if a chat with this user already exists
    const existingChatQuery = query(
        collection(firestore, 'chats'),
        where('userIds', '==', [currentUser.uid, user.id].sort())
    );

    const querySnapshot = await getDocs(existingChatQuery);

    if (!querySnapshot.empty) {
        // Chat exists, select it
        const chatId = querySnapshot.docs[0].id;
        setSelectedChatId(chatId);
    } else {
        // Chat doesn't exist, create it
        const usersData = [
            { id: currentUser.uid, name: currentUser.displayName || 'Me', avatar: currentUser.photoURL },
            { id: user.id, name: user.name, avatar: user.avatar }
        ];

        const newChatRef = await addDoc(collection(firestore, 'chats'), {
            userIds: [currentUser.uid, user.id].sort(),
            users: usersData,
            timestamp: serverTimestamp()
        });
        setSelectedChatId(newChatRef.id);
    }
  };


  const messagesQuery = selectedChatId
    ? query(collection(firestore, 'chats', selectedChatId, 'messages'), orderBy('timestamp', 'asc'))
    : null;
  const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);

  const selectedChat = chats?.find((chat) => chat.id === selectedChatId);
  const otherUser = selectedChat?.users.find((u) => u.id !== currentUser?.uid);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !selectedChatId || !currentUser) return;

    const messagesCol = collection(firestore, 'chats', selectedChatId, 'messages');

    await addDoc(messagesCol, {
      senderId: currentUser.uid,
      text: message.trim(),
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const userAvatar = (userId?: string) => {
    if (!userId) return null;
    const user = selectedChat?.users.find((u) => u.id === userId);
    return user?.avatar || null;
  }
  
  const contactAvatar = (user: UserType) => {
    return user.avatar;
  }

  const getAvatarFallback = (userId?: string) => {
    if (!userId) return 'U';
    const user = selectedChat?.users.find((u) => u.id === userId);
    return user?.name?.charAt(0).toUpperCase() || 'U';
  }

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Filter out the current user from the list
  const otherUsers = allUsers?.filter(u => u.id !== currentUser?.uid);

  const isLoading = isLoadingUser || isLoadingChats || isLoadingUsersList;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Card className="h-full">
        <CardContent className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr] p-0">
          <div className="flex flex-col border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {isLoading && <p className='p-2 text-sm text-muted-foreground'>Loading users...</p>}
                {!isLoading && otherUsers?.length === 0 && <p className='p-2 text-sm text-muted-foreground'>No other users found.</p>}
                {otherUsers?.map((user) => {
                   const chatWithUser = chats?.find(c => c.userIds.includes(user.id));
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent/50',
                        selectedChat?.userIds.includes(user.id) && 'bg-accent'
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={contactAvatar(user) || undefined} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <p className="font-medium">{user.name}</p>
                      </div>
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
                    <AvatarImage src={userAvatar(otherUser.id) || undefined} alt={otherUser.name} />
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
                    {isLoadingMessages && <p className='text-sm text-muted-foreground'>Loading messages...</p>}
                    {messages?.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex max-w-[75%] gap-2',
                          message.senderId === currentUser?.uid ? 'ml-auto flex-row-reverse' : ''
                        )}
                      >
                        <Avatar className="h-8 w-8">
                           <AvatarImage
                            src={userAvatar(message.senderId) || undefined}
                          />
                          <AvatarFallback>
                           {getAvatarFallback(message.senderId)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm',
                            message.senderId === currentUser?.uid
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p>{message.text}</p>
                           <time className="text-xs text-muted-foreground/80 block mt-1 text-right">
                              {formatTimestamp(message.timestamp)}
                            </time>
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
                    onChange={(e) => setMessage(e.target..value)}
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
             {!selectedChat && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
                  <p className="mt-4 text-lg text-muted-foreground">Select a user to start a conversation</p>
                  <p className="mt-2 text-sm text-muted-foreground">Or sign in with another account in a different browser to test.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
