import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <MailCheck className="h-6 w-6 text-accent-foreground" />
          </div>
          <CardTitle className="mt-4 text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please check your inbox to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or click below to resend.
          </p>
          <div className="space-y-4">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Resend Verification Email
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
