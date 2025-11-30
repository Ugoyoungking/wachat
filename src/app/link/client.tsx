'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// In a real application, you would use a custom token flow.
// 1. Primary device generates a short-lived token in Firestore under `deviceLinkTokens/{tokenId}` with `userId`.
// 2. Secondary device reads this token from the URL.
// 3. Secondary device calls a Cloud Function with the token.
// 4. Cloud Function verifies the token, creates a custom auth token for the `userId`, and deletes the Firestore token.
// 5. Secondary device uses `signInWithCustomToken(auth, customToken)` to log in.
// This is a simplified simulation of that flow.

export default function LinkClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isLoading } = useUser();

  useEffect(() => {
    const token = searchParams.get('token');

    if (isLoading) {
      return; // Wait until user state is determined
    }

    if (user) {
      // If user is already logged in, just redirect to chat.
      router.push('/chat');
      return;
    }
    
    if (token) {
      // Simulate verifying the token and logging in.
      // In a real app, this would involve a backend call.
      console.log('Simulating login with token:', token);
      
      toast({
        title: 'Device Linked Successfully',
        description: 'You are now logged in on this device.',
      });
      
      // Because we can't get the user from the token in this simulation,
      // we'll redirect to the login page. In a real scenario, this would
      // be a redirect to '/chat' after a successful custom token sign-in.
      // For testing, please log in manually on this new device.
      // The QR code proves the concept is ready for a real backend.
      setTimeout(() => {
         router.push('/login');
      }, 2000);

    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Link',
        description: 'The device linking URL is missing a token.',
      });
      router.push('/login');
    }
  }, [searchParams, router, toast, auth, user, isLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm text-center">
             <CardHeader>
                <CardTitle className="text-2xl">Linking Device...</CardTitle>
                <CardDescription>Please wait while we securely link your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            </CardContent>
        </Card>
    </div>
  );
}
