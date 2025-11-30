
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { Loader2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { type User as UserType } from '@/lib/data';

function AddFriendProcessor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, isLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    const addFriend = async () => {
      const userIdToAdd = searchParams.get('user');

      if (isLoading) {
        return; // Wait until user state is determined
      }
      
      if (!currentUser) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You need to be logged in to add a friend.',
        });
        router.push('/login');
        return;
      }

      if (!userIdToAdd) {
        toast({
          variant: 'destructive',
          title: 'Invalid Link',
          description: 'The add friend link is missing a user ID.',
        });
        router.push('/chat');
        return;
      }
      
      if (userIdToAdd === currentUser.uid) {
        toast({
          title: 'This is you!',
          description: "You can't add yourself as a friend.",
        });
        router.push('/chat');
        return;
      }

      // 1. Fetch the user to add
       const userToAddDocRef = doc(firestore, 'users', userIdToAdd);
       const userToAddDoc = await getDoc(userToAddDocRef);

       if (!userToAddDoc.exists()) {
           toast({
             variant: 'destructive',
             title: 'User Not Found',
             description: "The user you're trying to add doesn't exist.",
           });
           router.push('/chat');
           return;
       }

       const userToAddData = userToAddDoc.data() as UserType;


      // 2. Check if a chat already exists
      const existingChatQuery = query(
        collection(firestore, 'chats'),
        where('userIds', '==', [currentUser.uid, userIdToAdd].sort())
      );

      const querySnapshot = await getDocs(existingChatQuery);
      let chatId: string;

      if (!querySnapshot.empty) {
        chatId = querySnapshot.docs[0].id;
        toast({
            title: 'Already Friends',
            description: `You are already in a chat with ${userToAddData.name}.`,
        });

      } else {
        // 3. Create new chat if it doesn't exist
        const usersData = [
            { id: currentUser.uid, name: currentUser.displayName || 'Me', avatar: currentUser.photoURL },
            { id: userToAddData.id, name: userToAddData.name, avatar: userToAddData.avatar }
        ];

        const newChatRef = await addDoc(collection(firestore, 'chats'), {
            userIds: [currentUser.uid, userToAddData.id].sort(),
            users: usersData,
            timestamp: serverTimestamp()
        });
        chatId = newChatRef.id;
        toast({
            title: 'Friend Added!',
            description: `You can now chat with ${userToAddData.name}.`,
        });
      }

      // 4. Redirect to the chat
      router.push(`/chat?chatId=${chatId}`);
    };

    addFriend();
  }, [searchParams, router, toast, firestore, currentUser, isLoading]);

  // This component doesn't render anything itself, it just runs the effect.
  // The UI is handled by the parent AddFriendClient.
  return null;
}


export default function AddFriendClient() {
  return (
    <>
      <Suspense fallback={null}>
        <AddFriendProcessor />
      </Suspense>
      <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-sm text-center">
               <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                      <UserPlus className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="mt-4 text-2xl">Adding Friend...</CardTitle>
                  <CardDescription>Please wait while we connect you.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              </CardContent>
          </Card>
      </div>
    </>
  );
}
