import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayoutProvider } from '@/components/conditional-layout-provider';
import { FirebaseProvider } from '@/firebase/provider';

const logoSvg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 3.33331C10.8 3.33331 3.33337 9.89998 3.33337 17.9166C3.33337 22.3333 5.56671 26.2333 9.16671 28.8333C9.66671 29.2166 10.0167 29.75 10.15 30.35L11.1334 34.1C11.35 34.9833 12.5 35.3 13.15 34.65L17.1 30.7C17.3834 30.4166 17.75 30.25 18.15 30.25H20C29.2 30.25 36.6667 23.6833 36.6667 15.6666C36.6667 7.64998 29.2 3.33331 20 3.33331Z" fill="#292A59"/><path d="M16.4137 11.25L19.997 19.1667L23.5804 11.25H26.6637L21.6637 22.0833H18.3304L13.3304 11.25H16.4137Z" fill="white"/></svg>`;
const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(logoSvg)}`;

const appUrl = "https://wachat-app.vercel.app/";

export const metadata: Metadata = {
  title: 'WaChat — Secure & Lightweight Messaging App for Web, Mobile & Desktop',
  description: 'WaChat is a secure, fast messaging app with end-to-end encryption, multi-device sync, and a polished web client (WaChat Web). Get started with email, Google, or Apple sign-in.',
  openGraph: {
    title: 'WaChat — Secure & Lightweight Messaging App for Web, Mobile & Desktop',
    description: 'WaChat is a secure, fast messaging app with end-to-end encryption, multi-device sync, and a polished web client (WaChat Web). Get started with email, Google, or Apple sign-in.',
    url: appUrl,
    siteName: 'WaChat',
    images: [
      {
        url: `${appUrl}og-image.png`, // Update with your actual OG image path
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WaChat — Secure & Lightweight Messaging App for Web, Mobile & Desktop',
    description: 'WaChat is a secure, fast messaging app with end-to-end encryption, multi-device sync, and a polished web client (WaChat Web). Get started with email, Google, or Apple sign-in.',
    images: [`${appUrl}og-image.png`], // Update with your actual OG image path
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WaChat",
  "legalName": "WaChat Inc.",
  "url": appUrl,
  "logo": `${appUrl}assets/logo-512.png`,
  "sameAs": [
    "https://github.com/Ugoyoungking"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@wachat.example.com"
    }
  ]
};

const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "WaChat",
    "operatingSystem": "iOS, Android, Web",
    "applicationCategory": "Communication",
    "url": `${appUrl}download`,
    "description": "WaChat is a secure, privacy-first messaging app with end-to-end encryption and multi-device sync.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "1200"
    }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <link rel="icon" href={faviconDataUri} type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          <ConditionalLayoutProvider>{children}</ConditionalLayoutProvider>
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
