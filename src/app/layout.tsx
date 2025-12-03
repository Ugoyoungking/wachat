import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayoutProvider } from '@/components/conditional-layout-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const logoSvg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 3.33331C10.8 3.33331 3.33337 9.89998 3.33337 17.9166C3.33337 22.3333 5.56671 26.2333 9.16671 28.8333C9.66671 29.2166 10.0167 29.75 10.15 30.35L11.1334 34.1C11.35 34.9833 12.5 35.3 13.15 34.65L17.1 30.7C17.3834 30.4166 17.75 30.25 18.15 30.25H20C29.2 30.25 36.6667 23.6833 36.6667 15.6666C36.6667 7.64998 29.2 3.33331 20 3.33331Z" fill="#292A59"/><path d="M16.4137 11.25L19.997 19.1667L23.5804 11.25H26.6637L21.6637 22.0833H18.3304L13.3304 11.25H16.4137Z" fill="white"/></svg>`;
const faviconDataUri = `https://image2url.com/images/1760142261420-af7d0397-6b65-4c2b-b873-ed74cbecf265.jpg`;

const appUrl = "https://wachat-app.vercel.app/";

export const metadata: Metadata = {
  title: 'WaChat — Fast, Secure, Modern Messaging by UgoAI Studios',
  description: 'WaChat is a privacy-first messaging platform by UgoAI Studios. Real-time chats, E2EE, multi-device linking (WaChat Web), and seamless media sharing. Sign up with Email, Google or Apple.',
  keywords: 'WaChat, messaging app, secure chat, multi-device messaging, WaChat Web, UgoAI Studios, Ugochukwu Jonathan',
  authors: [{ name: 'UgoAI Studios' }],
  metadataBase: new URL(appUrl),
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
        url: 'https://image2url.com/images/1760142261420-af7d0397-6b65-4c2b-b873-ed74cbecf265.jpg',
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
    images: ['https://image2url.com/images/1760142261420-af7d0397-6b65-4c2b-b873-ed74cbecf265.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: faviconDataUri,
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
