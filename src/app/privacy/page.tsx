
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="font-bold">WaChat</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className='bg-accent text-accent-foreground hover:bg-accent/90'>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <div className="container max-w-4xl py-12 md:py-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold text-foreground pt-4">1. Introduction</h2>
            <p>
              Welcome to WaChat. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your information when you use our app.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">2. Information We Collect</h2>
            <p>
              We only collect information that is necessary to provide you with our service. This includes:
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Account Information:</strong> Your name, email address, and profile picture.</li>
                <li><strong>Device Information:</strong> We may collect information about the device you use to access WaChat, such as your IP address, operating system, and device identifiers for linking devices.</li>
                <li><strong>Usage Information:</strong> We do not store your message content. Due to our end-to-end encryption, we cannot access or read your messages. We may collect metadata such as timestamps of messages.</li>
              </ul>
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide, operate, and maintain our services.</li>
                <li>Verify your account and prevent fraud.</li>
                <li>Allow you to link and sync your account across multiple devices.</li>
              </ul>
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">4. End-to-End Encryption</h2>
            <p>
              All communications on WaChat are end-to-end encrypted. This means that your messages, photos, videos, and voice notes are secured with a lock, and only you and the recipient have the special key needed to unlock and read them. Not even WaChat can read your messages.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
