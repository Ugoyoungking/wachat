
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Last updated: July 26, 2024</p>
            
            <h2 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
            <p>
              By using WaChat, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our service.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">2. Description of Service</h2>
            <p>
              WaChat provides a secure, end-to-end encrypted messaging service. You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, followers, username, or any account rights.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">3. User Conduct</h2>
            <p>
              You agree not to use the service to:
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Post violent, defamatory, infringing, hateful, or sexually suggestive content.</li>
                <li>Harass, bully, or intimidate other users.</li>
                <li>Use the service for any illegal or unauthorized purpose.</li>
              </ul>
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">4. Disclaimers</h2>
            <p>
              The service is provided "as is" and "as available". WaChat disclaims all warranties of any kind, whether express or implied. We do not guarantee that the service will be safe or secure.
            </p>

            <h2 className="text-xl font-semibold text-foreground pt-4">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, WaChat shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
