
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { GoogleIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signInWithGoogle, signUpWithEmailAndPassword } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isLoading } = useUser();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/chat');
    }
  }, [user, isLoading, router]);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await signUpWithEmailAndPassword(auth, email, password, name);
      router.push('/verify-email');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error signing up',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
      await signInWithGoogle(auth);
       // The useEffect hook will handle redirection
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing in',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (user) {
    return null; // Don't render the page if user is already logged in
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started with WaChat.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Sign Up
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
