
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayoutProvider } from '@/components/conditional-layout-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const appUrl = "https://wachat-app.vercel.app/";
const imageUrl = 'https://image2url.com/images/1760142261420-af7d0397-6b65-4c2b-b873-ed74cbecf265.jpg';

export const metadata: Metadata = {
  title: 'WaChat — Fast, Secure, Modern Messaging by UgoAI Studios',
  description: 'WaChat is a privacy-first messaging platform by UgoAI Studios. Real-time chats, E2EE, multi-device linking (WaChat Web), and seamless media sharing. Sign up with Email, Google or Apple.',
  keywords: 'WaChat, messaging app, secure chat, multi-device messaging, WaChat Web, UgoAI Studios, Ugochukwu Jonathan',
  authors: [{ name: 'UgoAI Studios' }],
  metadataBase: new URL(appUrl),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    url: appUrl,
    title: 'WaChat — Fast, Secure, Modern Messaging',
    description: 'WaChat by UgoAI Studios — privacy-first messaging with multi-device sync and web client.',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'WaChat Application Screenshot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WaChat — Fast, Secure, Modern Messaging',
    description: 'Secure messaging with E2EE, WaChat Web multi-device linking, and fast media sharing.',
    images: [imageUrl],
  },
  icons: {
    icon: imageUrl,
    apple: imageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://wachat-app.vercel.app/#organization",
      "name": "UgoAI Studios",
      "url": "https://wachat-app.vercel.app/",
      "logo": "https://image2url.com/images/1760142261420-af7d0397-6b65-4c2b-b873-ed74cbecf265.jpg",
      "sameAs": [
        "https://github.com/Ugoyoungking",
        "https://linkedin.com/in/ugochukwu-jonathan067",
        "https://wa.me/2349127714886"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "support@wachat-app.vercel.app",
          "url": "https://wachat-app.vercel.app/contact",
          "availableLanguage": ["English"]
        }
      ]
    },
    {
      "@type": "Person",
      "@id": "https://wachat-app.vercel.app/#founder",
      "name": "Ugochukwu Jonathan",
      "alternateName": "Ugoyoungking",
      "jobTitle": "Founder & Lead Developer",
      "worksFor": { "@id": "https://wachat-app.vercel.app/#organization" },
      "url": "https://ugoyoungking.github.io/portfolio/",
      "image": [
        "https://image2url.com/images/1760142087082-0d9360e4-2d41-4459-a0a1-135afa56a7f7.jpg"
      ],
      "sameAs": [
        "https://github.com/Ugoyoungking",
        "https://linkedin.com/in/ugochukwu-jonathan067",
        "https://www.truelancer.com/freelancer/tlusera2eae11"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rivers State",
        "addressCountry": "Nigeria"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://wachat-app.vercel.app/#website",
      "url": "https://wachat-app.vercel.app/",
      "name": "WaChat",
      "publisher": { "@id": "https://wachat-app.vercel.app/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://wachat-app.vercel.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "MobileApplication",
      "@id": "https://wachat-app.vercel.app/#mobileapp",
      "name": "WaChat",
      "operatingSystem": "iOS, Android, Web",
      "applicationCategory": "Communication",
      "url": "https://wachat-app.vercel.app/",
      "installUrl": "https://wachat-app.vercel.app/",
      "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" },
      "creator": { "@id": "https://wachat-app.vercel.app/#organization" },
      "screenshot": [
        "https://wachat-app.vercel.app/assets/preview1.png",
        "https://wachat-app.vercel.app/assets/preview2.png"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://wachat-app.vercel.app/#softwareapp",
      "name": "WaChat",
      "url": "https://wachat-app.vercel.app/",
      "applicationCategory": "Communication",
      "operatingSystem": "Any",
      "description": "WaChat is a privacy-first messaging app featuring end-to-end encryption, multi-device linking (WaChat Web), real-time messaging, and media sharing.",
      "publisher": { "@id": "https://wachat-app.vercel.app/#organization" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1283"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://wachat-app.vercel.app/#webapp",
      "name": "WaChat Web",
      "url": "https://wachat-app.vercel.app/",
      "browserRequirements": "JavaScript required; modern browsers recommended (Chrome, Edge, Firefox)",
      "operatingSystem": "Web",
      "creator": { "@id": "https://wachat-app.vercel.app/#organization" }
    },
    {
      "@type": "FAQPage",
      "@id": "https://wachat-app.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I link WaChat Web?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Open WaChat Web and scan the QR code from WaChat mobile under Linked Devices. Confirm the pairing on your phone to securely link the web client."
          }
        },
        {
          "@type": "Question",
          "name": "What sign-in options does WaChat support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WaChat supports Email/Password (with email verification), Google Sign-In and Apple Sign In."
          }
        },
        {
          "@type": "Question",
          "name": "Is WaChat free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — core messaging and device linking are free. Some premium features may be added later."
          }
        }
      ]
    },
    {
      "@type": "ContactPoint",
      "@id": "https://wachat-app.vercel.app/#contact",
      "contactType": "customer support",
      "email": "support@wachat-app.vercel.app",
      "url": "https://wachat-app.vercel.app/contact",
      "availableLanguage": ["English"]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="W3MpZ-n3f__nszkbbn7M_8K2F8fttcYJTqwkJrwfX8o" />
        <meta name="msvalidate.01" content="63A610B3C9552E33F88103CB9AD8CF70" />
        <meta name="theme-color" content="#0A7CFF" />
        <link rel="alternate" hrefLang="en" href="https://wachat-app.vercel.app/" />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ConditionalLayoutProvider>{children}</ConditionalLayoutProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
