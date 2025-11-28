
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">About WaChat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-lg text-muted-foreground">
            <p>
              WaChat was born from a simple idea: communication should be private, secure, and intelligent. In a world where digital privacy is increasingly scarce, we set out to build a messaging app that puts you in control of your data.
            </p>
            <p>
              Our core mission is to provide a seamless and secure communication experience. We believe that you shouldn't have to choose between powerful features and your privacy. That's why we've integrated end-to-end encryption by default into every chat, ensuring that only you and the person you're talking to can read your messages.
            </p>
            <div className="text-center pt-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">About the Developer</h2>
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="https://github.com/Ugoyoungking.png" alt="Developer Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground">Ugochukwu</h3>
                <p className="text-md mt-1">Lead Developer</p>
                <p className="mt-4 max-w-md">
                  A passionate software developer with a focus on building secure, user-centric applications. Believes in the power of technology to connect people and protect their digital rights.
                </p>
                <div className="mt-4">
                  <Button asChild variant="link">
                    <a href="https://github.com/Ugoyoungking/wachat" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
