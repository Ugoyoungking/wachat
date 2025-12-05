
'use client';

import { useState, useEffect, FormEvent, Suspense, useRef, useCallback } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, where, getDocs, limit, doc, getDoc, updateDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError, useCollection, useDoc } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { type Chat, type Message, type User as UserType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Lock, MoreVertical, Paperclip, Search, Send, MessageSquare, BellOff, Users, Phone, Video, ArrowLeft, Loader2, MessageSquarePlus, UserSearch, Check, CheckCheck, Smile, CornerUpLeft, Copy, Trash2, Star, MoreHorizontal, Forward } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AudioCall } from '@/components/audio-call';
import { VideoCall } from '@/components/video-call';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNowStrict } from 'date-fns';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😯', '😢', '🙏'];


function MessageBubble({ 
    message, 
    isCurrentUser, 
    userAvatar, 
    getAvatarFallback,
    chatId,
    currentUser
}: { 
    message: Message, 
    isCurrentUser: boolean,
    userAvatar: (userId?: string) => string | null,
    getAvatarFallback: (userId?: string) => string,
    chatId: string,
    currentUser: UserType | null
}) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleReaction = async (emoji: string) => {
        if (!firestore || !currentUser) return;
        const messageRef = doc(firestore, 'chats', chatId, 'messages', message.id);
        
        const currentReactions = message.reactions || {};
        const userList = currentReactions[emoji] || [];

        let newReactions: { [emoji: string]: string[] };

        if (userList.includes(currentUser.uid)) {
            // User is removing their reaction
            const updatedUserList = userList.filter(uid => uid !== currentUser.uid);
            if (updatedUserList.length === 0) {
                const { [emoji]: _, ...rest } = currentReactions;
                newReactions = rest;
            } else {
                newReactions = { ...currentReactions, [emoji]: updatedUserList };
            }
        } else {
            // User is adding a reaction
            newReactions = { ...currentReactions, [emoji]: [...userList, currentUser.uid] };
        }

        const reactionData = { reactions: newReactions };
        await updateDoc(messageRef, reactionData).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: messageRef.path,
                operation: 'update',
                requestResourceData: reactionData,
            }));
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message.text);
        toast({ title: "Copied to clipboard" });
    }
    
    const handleDeleteMessage = async () => {
        if (!firestore) return;
        const messageRef = doc(firestore, 'chats', chatId, 'messages', message.id);
        await deleteDoc(messageRef).catch(err => {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: messageRef.path,
                operation: 'delete',
            }));
        });
    }

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const messageContent = (
        <div className="group relative">
             <div
                className={cn(
                    'rounded-lg px-3 py-2 text-sm break-words',
                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card'
                )}
            >
                <p>{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                    <time className="text-xs text-muted-foreground/80">
                        {formatTimestamp(message.timestamp)}
                    </time>
                    {isCurrentUser && (
                        message.read ? <CheckCheck className="h-4 w-4 text-accent" /> : <Check className="h-4 w-4 text-muted-foreground/80" />
                    )}
                </div>
            </div>

            {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className={cn(
                    "absolute -bottom-3 flex gap-1",
                    isCurrentUser ? "right-2" : "left-2",
                )}>
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                       users.length > 0 && (
                         <div key={emoji} className="flex items-center rounded-full bg-secondary px-1.5 py-0.5 shadow-sm">
                             <span className='text-xs'>{emoji}</span>
                             <span className='ml-1 text-xs font-medium text-secondary-foreground'>{users.length}</span>
                         </div>
                       )
                    ))}
                </div>
            )}
            
            <div className={cn(
                "absolute top-1/2 -translate-y-1/2 items-center gap-1 rounded-full border bg-card p-1 shadow-sm opacity-0 transition-opacity group-hover:opacity-100",
                isCurrentUser ? "-left-11" : "-right-11"
            )}>
                 <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-6 w-6"><Smile className="h-4 w-4" /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1">
                        <div className="flex gap-1">
                            {EMOJI_REACTIONS.map(emoji => (
                                <Button key={emoji} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-lg" onClick={() => handleReaction(emoji)}>
                                    {emoji}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <div
                    className={cn(
                        'flex max-w-[75%] gap-2 cursor-pointer',
                        isCurrentUser ? 'ml-auto flex-row-reverse' : ''
                    )}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar(message.senderId) || undefined} />
                        <AvatarFallback>{getAvatarFallback(message.senderId)}</AvatarFallback>
                    </Avatar>
                   {messageContent}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCurrentUser ? 'end' : 'start'}>
                <DropdownMenuItem>
                    <CornerUpLeft className="mr-2 h-4 w-4" />
                    <span>Reply</span>
                </DropdownMenuItem>
                 <DropdownMenuItem>
                    <Forward className="mr-2 h-4 w-4" />
                    <span>Forward</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Star</span>
                </DropdownMenuItem>
                {isCurrentUser && (
                    <DropdownMenuItem className="text-destructive" onClick={handleDeleteMessage}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


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
  const [isAudioCalling, setIsAudioCalling] = useState(false);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const isMobile = useIsMobile();
  const ringingAudioRef = useRef<HTMLAudioElement>(null);

  const chatDocRef = useMemoFirebase(() => selectedChatId && firestore ? doc(firestore, 'chats', selectedChatId) : null, [selectedChatId, firestore]);
  const { data: selectedChat } = useDoc<Chat>(chatDocRef);
  
  const messagesQuery = useMemoFirebase(() => selectedChatId
    ? query(collection(firestore, 'chats', selectedChatId, 'messages'), orderBy('timestamp', 'asc'))
    : null, [selectedChatId, firestore]);
  const { data: messages, isLoading: isLoadingMessages } = useCollection<Message>(messagesQuery);
  
  const otherUserId = selectedChat?.userIds.find(id => id !== currentUser?.uid);
  const otherUserDocRef = useMemoFirebase(() => otherUserId && firestore ? doc(firestore, 'users', otherUserId) : null, [otherUserId, firestore]);
  const { data: otherUser } = useDoc<UserType>(otherUserDocRef);

  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  
  useEffect(() => {
    if (!messages || !currentUser || !firestore || !selectedChatId) return;
  
    const unreadMessages = messages.filter(m => m.senderId !== currentUser.uid && !m.read);
  
    if (unreadMessages.length > 0) {
      const batch = writeBatch(firestore);
      unreadMessages.forEach(message => {
        const msgRef = doc(firestore, 'chats', selectedChatId, 'messages', message.id);
        batch.update(msgRef, { read: true });
      });
      batch.commit().catch(err => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: `chats/${selectedChatId}/messages`,
            operation: 'update',
            requestResourceData: { read: true }
         }));
      });
    }
  }, [messages, currentUser, firestore, selectedChatId]);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.querySelector(':scope > div');
        if (scrollableViewport) {
            scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !selectedChatId || !currentUser || !firestore) return;

    const messagesCol = collection(firestore, 'chats', selectedChatId, 'messages');
    
    const messageData = {
      senderId: currentUser.uid,
      text: message.trim(),
      timestamp: serverTimestamp(),
      read: false,
    };
    
    await addDoc(messagesCol, messageData).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: messagesCol.path,
        operation: 'create',
        requestResourceData: messageData
      }));
    });
    
    setMessage('');
  };
  
  const handleTyping = (text: string) => {
      setMessage(text);
      // Typing indicator logic can be added here
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const userAvatar = useCallback((userId?: string) => {
    if (!userId) return null;
    const user = selectedChat?.users.find((u) => u.id === userId);
    return user?.avatar || null;
  }, [selectedChat]);

  const getAvatarFallback = useCallback((userId?: string) => {
    if (!userId) return 'U';
    const user = selectedChat?.users.find((u) => u.id === userId);
    return user?.name?.charAt(0).toUpperCase() || 'U';
  }, [selectedChat]);

  const startAudioCall = () => {
    if (ringingAudioRef.current) {
      ringingAudioRef.current.play().catch(console.error);
    }
    setIsAudioCalling(true);
  }

  const startVideoCall = () => {
    if (ringingAudioRef.current) {
      ringingAudioRef.current.play().catch(console.error);
    }
    setIsVideoCalling(true);
  }

  if (!selectedChatId) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full text-center bg-background p-8 border-l">
          <Image src="https://picsum.photos/seed/wachat-logo/300/300" alt="WaChat Web" width={300} height={300} className="rounded-full" data-ai-hint="logo encryption" />
          <h2 className="mt-8 text-3xl font-light text-foreground/80">WaChat Web</h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
              Send and receive messages without keeping your phone online.
              Use WaChat on up to 4 linked devices and 1 phone at the same time.
          </p>
          <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4"/>
              <span>Your personal messages are end-to-end encrypted</span>
          </div>
      </div>
    )
  }

  if (!otherUser) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }
  
  const getStatus = () => {
    if (otherUser?.status === 'online') return 'Online';
    if (otherUser?.lastSeen) {
      const lastSeenDate = (otherUser.lastSeen as any).toDate ? (otherUser.lastSeen as any).toDate() : new Date(otherUser.lastSeen as string);
      return `Last seen ${formatDistanceToNowStrict(lastSeenDate, { addSuffix: true })}`;
    }
    return 'Offline';
  };

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
          <AvatarFallback>{otherUser.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{otherUser.name}</p>
          <p className='text-sm text-muted-foreground'>{getStatus()}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={startVideoCall}>
          <Video className="h-5 w-5" />
        </Button>
         <Button variant="ghost" size="icon" onClick={startAudioCall}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {isLoadingMessages && <p className='text-sm text-muted-foreground'>Loading messages...</p>}
          {messages?.map((message) => (
             <MessageBubble 
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUser?.uid}
                userAvatar={userAvatar}
                getAvatarFallback={getAvatarFallback}
                chatId={selectedChatId}
                currentUser={currentUser}
             />
          ))}
        </div>
      </ScrollArea>
      <footer className="flex items-start gap-4 border-t border-sidebar-border bg-sidebar-panel-background p-4">
        <Textarea
          placeholder="Type a message..."
          className="min-h-0 flex-1 resize-none bg-card border-none focus-visible:ring-1"
          rows={1}
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="ghost" size="icon" type="button">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={!message.trim()} onClick={handleSendMessage}>
          <Send className="h-5 w-5" />
        </Button>
      </footer>
      {isAudioCalling && otherUser && (
        <AudioCall
          contact={otherUser} 
          onClose={() => setIsAudioCalling(false)} 
          ringingAudioRef={ringingAudioRef}
        />
      )}
      {isVideoCalling && otherUser && (
        <VideoCall
          contact={otherUser} 
          onClose={() => setIsVideoCalling(false)} 
          ringingAudioRef={ringingAudioRef}
        />
      )}
      <audio ref={ringingAudioRef} src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" loop className="hidden" />
    </div>
  )
}

function NewChatDialog({ onChatCreated }: { onChatCreated: (chatId: string) => void }) {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firestore) return;

    setIsLoading(true);
    setError(null);
    setFoundUser(null);

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email.trim()));

    getDocs(q)
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setError("User not found. Please check the email address.");
        } else {
          const userDoc = querySnapshot.docs[0];
          if (userDoc.id === currentUser?.uid) {
            setError("You can't start a chat with yourself.");
            return;
          }
          setFoundUser({ id: userDoc.id, ...userDoc.data() } as UserType);
        }
      })
      .catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'users',
          operation: 'list',
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const handleStartChat = async () => {
    if (!foundUser || !currentUser || !firestore) return;
    
    setIsLoading(true);
    const chatsCol = collection(firestore, 'chats');
    const sortedUserIds = [currentUser.uid, foundUser.id].sort();
    const existingChatQuery = query(
      chatsCol,
      where('userIds', '==', sortedUserIds)
    );

    getDocs(existingChatQuery)
      .then(querySnapshot => {
        let chatId: string;
        if (!querySnapshot.empty) {
            chatId = querySnapshot.docs[0].id;
            toast({ title: "Chat already exists", description: `Redirecting to your chat with ${foundUser.name}.`});
            onChatCreated(chatId);
            resetState();
        } else {
            const usersData = [
                { id: currentUser.uid, name: currentUser.displayName || 'Me', avatar: currentUser.photoURL },
                { id: foundUser.id, name: foundUser.name, avatar: foundUser.avatar }
            ];
            
            const newChatData = {
                userIds: sortedUserIds,
                users: usersData,
                timestamp: serverTimestamp(),
                lastMessage: { text: null, timestamp: serverTimestamp() }
            };

            addDoc(chatsCol, newChatData)
              .then(newChatRef => {
                chatId = newChatRef.id;
                toast({ title: "Chat created!", description: `You can now chat with ${foundUser.name}.`});
                onChatCreated(chatId);
                resetState();
              })
              .catch(err => {
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                  path: 'chats',
                  operation: 'create',
                  requestResourceData: newChatData
                }));
              });
        }
      })
      .catch(err => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'chats',
            operation: 'list',
         }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resetState = () => {
    setEmail('');
    setFoundUser(null);
    setError(null);
    setIsLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetState();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><MessageSquarePlus className="h-5 w-5"/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Chat</DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to chat with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="user@example.com" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading && !foundUser ? <Loader2 className="h-4 w-4 animate-spin"/> : <UserSearch className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Find User</span>
            </Button>
          </div>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}
        
        {foundUser && (
            <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border p-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={foundUser.avatar || undefined} alt={foundUser.name} />
                    <AvatarFallback>{foundUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="font-semibold">{foundUser.name}</p>
                    <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                </div>
                <Button onClick={handleStartChat} disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Start Chat
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


function ChatListPanel({ onSelectChat, selectedChatId }: { onSelectChat: (chatId: string) => void; selectedChatId: string | null; }) {
  const { user: currentUser, isLoading: isLoadingUser } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const chatsQuery = useMemoFirebase(() => currentUser
    ? query(collection(firestore, 'chats'), where('userIds', 'array-contains', currentUser.uid))
    : null, [currentUser, firestore]);
  const { data: chats, isLoading: isLoadingChats } = useCollection<Chat>(chatsQuery);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl) {
      onSelectChat(chatIdFromUrl);
    }
  }, [searchParams, onSelectChat]);
  
  // Presence management for online status
  useEffect(() => {
    if (!currentUser || !firestore) return;

    const userRef = doc(firestore, 'users', currentUser.uid);
    const onlineData = { status: 'online', lastSeen: serverTimestamp() };
    updateDoc(userRef, onlineData).catch(err => {
      if (err.code !== 'permission-denied') {
        console.error("Failed to set user online:", err);
      }
    });

    const handleVisibilityChange = () => {
      if (!document.hidden) {
         const onlineData = { status: 'online', lastSeen: serverTimestamp() };
         updateDoc(userRef, onlineData).catch(err => {
            if (err.code !== 'permission-denied') {
                console.error("Failed to set user online on visibility change:", err);
            }
         });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      const offlineData = { status: 'offline', lastSeen: serverTimestamp() };
      updateDoc(userRef, offlineData).catch(err => {
         // Don't emit here as it might happen during page unload.
         if (err.code !== 'permission-denied') {
            console.error("Failed to set user offline:", err);
         }
      });
    };
  }, [currentUser, firestore]);


  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    router.push(`/chat?chatId=${chatId}`, { scroll: false });
  }

  const isLoading = isLoadingUser || isLoadingChats;

  return (
    <div className="flex flex-col h-full w-full md:w-[380px] bg-sidebar-panel-background border-r border-sidebar-border">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">WaChat</h1>
          <div className="flex items-center gap-2">
            <NewChatDialog onChatCreated={handleSelectChat} />
            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search or start new chat" className="pl-9 bg-card" />
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
                    <p className="text-sm text-muted-foreground truncate">
                      No messages yet
                    </p>
                  </div>
                  <div className='text-xs text-muted-foreground self-start mt-1'>
                    
                  </div>
               </button>
             )
           })}
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
  const router = useRouter();

  useEffect(() => {
    const urlChatId = searchParams.get('chatId');
    if (urlChatId) {
      setSelectedChatId(urlChatId);
    } else {
      if (isMobile) {
        setSelectedChatId(null);
      }
    }
  }, [searchParams, isMobile]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      router.push(`/chat?chatId=${chatId}`, { scroll: false });
    }
  };
  
  const handleBack = () => {
    setSelectedChatId(null);
    router.push('/chat', { scroll: false });
  };

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }
  
  if (isMobile) {
    return (
      <div className="w-full h-screen overflow-hidden">
        <div className={cn(
          "w-full h-full transition-transform duration-300 ease-in-out",
          selectedChatId ? "-translate-x-full" : "translate-x-0"
        )}>
          <ChatListPanel onSelectChat={handleSelectChat} selectedChatId={selectedChatId} />
        </div>
        <div className={cn(
          "absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out",
          selectedChatId ? "translate-x-0" : "translate-x-full"
        )}>
          {selectedChatId && (
            <ChatArea 
              selectedChatId={selectedChatId} 
              currentUser={user} 
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatListPanel onSelectChat={handleSelectChat} selectedChatId={selectedChatId} />
      <div className="flex-1">
        <ChatArea 
          selectedChatId={selectedChatId} 
          currentUser={user} 
          onBack={handleBack}
        />
      </div>
    </>
  );
}

export default function ChatClient() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ChatClientContent />
    </Suspense>
  )
}
