
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FaqPage() {
  const faqs = [
    {
      question: 'Is WaChat free to use?',
      answer: 'Yes, WaChat is completely free to use for personal messaging.',
    },
    {
      question: 'How does End-to-End Encryption (E2EE) work?',
      answer:
        "E2EE ensures that only you and the person you're communicating with can read what's sent, and nobody in between, not even WaChat. Your messages are secured with a lock, and only the recipient has the special key to unlock and read them.",
    },
    {
      question: 'Can I use WaChat on multiple devices?',
      answer:
        'Yes! We support multi-device linking. You can use your WaChat account on your phone, laptop, and tablet simultaneously, with all your chats synced in real-time.',
    },
    {
      question: 'What is the WaChat AI?',
      answer:
        'WaChat AI is your personal assistant built right into the app. It can help you find information with web search, answer questions, and more, all within your chat interface.',
    },
    {
      question: 'How do I create a Custom AI?',
      answer: 'You can create a custom AI by navigating to the "Custom AI" page. There, you can give your AI a name, provide it with specific instructions, and even give it custom data to work with.',
    },
  ];

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
            <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-md text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
