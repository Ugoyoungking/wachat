
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';

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
        <Card className="overflow-hidden">
          <div className="bg-primary/10 p-10 text-center">
            <h1 className="text-4xl font-bold text-primary">About WaChat</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Private, Secure, and Intelligent Communication.
            </p>
          </div>
          <CardContent className="p-8 space-y-8 text-lg">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                WaChat was born from a simple idea: communication should be private by default. In a world where digital privacy is increasingly scarce, we set out to build a messaging app that puts you in control of your data without compromising on features. We believe you shouldn't have to choose between powerful tools and your privacy. That's why we've integrated end-to-end encryption into every chat, ensuring that only you and the person you're talking to can read your messages.
              </p>
            </div>
            
            <div className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">About the Developer</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="h-36 w-36 border-4 border-accent">
                  <AvatarImage src="https://github.com/Ugoyoungking.png" alt="Developer Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className='text-center md:text-left'>
                  <h3 className="text-2xl font-bold text-foreground">Ugochukwu Jonathan</h3>
                  <p className="text-lg text-accent font-semibold mt-1">Lead Developer & Founder</p>
                  <p className="mt-4 max-w-lg text-muted-foreground">
                    A passionate software developer with a focus on building secure, user-centric applications. Believes in the power of technology to connect people and protect their digital rights.
                  </p>
                  <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
                    <Button asChild variant="ghost" size="icon">
                      <a href="https://github.com/Ugoyoungking" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                     <Button asChild variant="ghost" size="icon">
                      <a href="https://www.linkedin.com/in/ugochukwu-jonathan067/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                     <Button asChild variant="ghost" size="icon">
                      <a href="mailto:ugochukwujonathan067@gmail.com" aria-label="Email">
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
