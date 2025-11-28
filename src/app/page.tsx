
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { AuthLayout } from '@/components/auth-layout';

function LandingPage() {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'End-to-End Encryption',
      description: 'Your conversations are private. Not even we can read them.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Real-time Messaging',
      description: 'Send and receive messages instantly, without any delay.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Assistant',
      description: 'Get help from our smart WaChat AI, right within your chat.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Secure, Fast, and Intelligent Messaging
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Welcome to WaChat, the messaging app that puts your privacy first with end-to-end encryption and powerful AI features.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className='bg-accent text-accent-foreground hover:bg-accent/90'>
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container">
            <h2 className="text-center text-3xl font-bold">Why WaChat?</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} WaChat. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// We need a wrapper to conditionally apply layout, but since this is a public
// page, we will render it without the AuthLayout or AppLayout.
export default function Page() {
  return <LandingPage />;
}
