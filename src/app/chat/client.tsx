
'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { type Chat, type Message, type User as UserType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Lock, MoreVertical, Paperclip, Search, Send, MessageSquare, BellOff, Users, Phone, Video, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { VideoCall } from '@/components/video-call';
import { useIsMobile } from '@/hooks/use-mobile';

function ChatArea({ 
  selectedChatId, 
  currentUser,
  onBack
}: { 
  selectedChatId: string | null; 
  currentUser: UserType | null;
  onBack: () => void;
}) {
  const firestore = useFirestore();
  const [isCalling, setIsCalling] = useState(false);
  const isMobile = useIsMobile();

  const messagesQuery = selectedChatId
    ? query(collection(firestore, 'chats', selectedChatId, 'messages'), orderBy('timestamp', 'asc'))
    : null;
  const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
        if (!selectedChatId || !firestore) return;
        const chatDoc = await getDoc(doc(firestore, 'chats', selectedChatId));
        if (chatDoc.exists()) {
            setSelectedChat({ id: chatDoc.id, ...chatDoc.data() } as Chat);
        }
    }
    fetchChat();
  }, [selectedChatId, firestore]);

  const [message, setMessage] = useState('');
  
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
  
  if (!selectedChatId) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full text-center bg-background p-8">
          <Image src="https://picsum.photos/seed/windows/400/250" alt="Placeholder" width={400} height={250} className="rounded-lg" data-ai-hint="communication laptop" />
          <h2 className="mt-8 text-3xl font-light text-foreground/80">Download WaChat for Windows</h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
              Make calls, share your screen and get a faster experience when you download the Windows app.
          </p>
          <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">Download</Button>
          <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4"/>
              <span>Your personal messages are end-to-end encrypted</span>
          </div>
      </div>
    )
  }

  if (!otherUser) {
    return <div className="flex-1 flex items-center justify-center"><p>Loading chat...</p></div>
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center gap-4 border-b border-sidebar-border bg-sidebar-panel-background p-4 h-16">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar>
          <AvatarImage src={userAvatar(otherUser.id) || undefined} alt={otherUser.name} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{otherUser.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsCalling(true)}>
          <Video className="h-5 w-5" />
        </Button>
         <Button variant="ghost" size="icon" onClick={() => setIsCalling(true)}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>
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
                    : 'bg-card'
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
      <footer className="flex items-start gap-4 border-t border-sidebar-border bg-sidebar-panel-background p-4">
        <Textarea
          placeholder="Type a message..."
          className="min-h-0 flex-1 resize-none bg-card border-none focus-visible:ring-1"
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="ghost" size="icon" type="button">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={!message.trim()} onClick={handleSendMessage}>
          <Send className="h-5 w-5" />
        </Button>
      </footer>
      {isCalling && otherUser && (
        <VideoCall 
          contact={otherUser} 
          onClose={() => setIsCalling(false)} 
        />
      )}
    </div>
  )
}

function ChatListPanel({ onSelectChat, selectedChatId }: { onSelectChat: (chatId: string) => void; selectedChatId: string | null; }) {
  const { user: currentUser, isLoading: isLoadingUser } = useUser();
  const firestore = useFirestore();

  const chatsQuery = currentUser
    ? query(collection(firestore, 'chats'), where('userIds', 'array-contains', currentUser.uid))
    : null;
  const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);

  const usersQuery = !isLoadingUser && currentUser ? query(collection(firestore, 'users')) : null;
  const { data: allUsers, isLoading: isLoadingUsersList } = useCollection<UserType>(usersQuery);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl) {
      onSelectChat(chatIdFromUrl);
    }
  }, [searchParams, onSelectChat]);


  const handleSelectUser = async (user: UserType) => {
    if (!currentUser) return;
    
    const existingChatQuery = query(
        collection(firestore, 'chats'),
        where('userIds', '==', [currentUser.uid, user.id].sort())
    );

    const querySnapshot = await getDocs(existingChatQuery);

    let chatId: string;
    if (!querySnapshot.empty) {
        chatId = querySnapshot.docs[0].id;
    } else {
        const usersData = [
            { id: currentUser.uid, name: currentUser.displayName || 'Me', avatar: currentUser.photoURL },
            { id: user.id, name: user.name, avatar: user.avatar }
        ];

        const newChatRef = await addDoc(collection(firestore, 'chats'), {
            userIds: [currentUser.uid, user.id].sort(),
            users: usersData,
            timestamp: serverTimestamp()
        });
        chatId = newChatRef.id;
    }
    onSelectChat(chatId);
  };
  
  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
  }

  const otherUsers = allUsers?.filter(u => u.id !== currentUser?.uid);
  const isLoading = isLoadingUser || isLoadingChats || isLoadingUsersList;

  return (
    <div className="flex flex-col h-full w-full md:w-[380px] bg-sidebar-panel-background border-r border-sidebar-border">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">WaChat</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Users className="h-5 w-5"/></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Ask Meta AI or Search" className="pl-9 bg-card" />
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" className='rounded-full'>All</Button>
            <Button variant="ghost" size="sm" className='rounded-full'>Unread</Button>
            <Button variant="ghost" size="sm" className='rounded-full'>Favorites</Button>
            <Button variant="ghost" size="sm" className='rounded-full'>Groups</Button>
        </div>
      </div>
       <div className='px-4 pb-2'>
        <Alert className='bg-accent/20 border-none'>
            <BellOff className="h-4 w-4" />
            <AlertTitle className='font-normal'>Message notifications are off. <a href="#" className='font-bold underline'>Turn on</a></AlertTitle>
        </Alert>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
           {isLoading && <p className='p-2 text-sm text-muted-foreground'>Loading chats...</p>}
           {!isLoading && chats?.map((chat) => {
             const otherUser = chat.users.find(u => u.id !== currentUser?.uid);
             return (
               <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary',
                    selectedChatId === chat.id && 'bg-secondary'
                  )}
               >
                  <Avatar>
                    <AvatarImage src={otherUser?.avatar || undefined} alt={otherUser?.name || 'User'} />
                    <AvatarFallback>{otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-medium">{otherUser?.name}</p>
                    <p className="text-sm text-muted-foreground">Last message...</p>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                      10:22 AM
                  </div>
               </button>
             )
           })}

            {/* Temporary display of all users to start chat */}
            <div className='mt-4 border-t pt-2'>
                <p className='px-2 pb-2 text-sm font-semibold text-muted-foreground'>Start a new chat</p>
                {isLoading && <p className='p-2 text-sm text-muted-foreground'>Loading users...</p>}
                {!isLoading && otherUsers?.length === 0 && <p className='p-2 text-sm text-muted-foreground'>No other users found.</p>}
                {otherUsers?.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary'
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </button>
                ))}
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}


function ChatClientContent() {
  const searchParams = useSearchParams();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { user, isLoading } = useUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    const urlChatId = searchParams.get('chatId');
    if (urlChatId) {
      setSelectedChatId(urlChatId);
    }
  }, [searchParams]);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><p>Loading...</p></div>
  }
  
  if (isMobile) {
    return (
      <div className='w-full'>
        {!selectedChatId ? (
          <ChatListPanel onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
        ) : (
          <ChatArea 
            selectedChatId={selectedChatId} 
            currentUser={user} 
            onBack={() => setSelectedChatId(null)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <ChatListPanel onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      <div className="flex-1">
        <ChatArea 
          selectedChatId={selectedChatId} 
          currentUser={user} 
          onBack={() => setSelectedChatId(null)}
        />
      </div>
    </>
  );
}

export default function ChatClient() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p>Loading Chat...</p></div>}>
      <ChatClientContent />
    </Suspense>
  )
}

    