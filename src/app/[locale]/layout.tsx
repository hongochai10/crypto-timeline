import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ErrorBoundary from "@/components/ErrorBoundary";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import OfflineIndicator from "@/components/OfflineIndicator";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://crypto-timeline.techbi.dev"),
  title: "Crypto Timeline — A History of Cryptography",
  description:
    "An interactive museum-exhibit experience walking through the evolution of cryptography: from Caesar Cipher to Post-Quantum Cryptography.",
  keywords: ["cryptography", "AES", "RSA", "ECC", "post-quantum", "DES", "Caesar cipher"],
  authors: [{ name: "TechBi Company" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crypto Timeline",
  },
  openGraph: {
    title: "Crypto Timeline",
    description: "From Caesar to Quantum — An Interactive Cryptography Journey",
    type: "website",
    siteName: "Crypto Timeline",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Timeline — A History of Cryptography",
    description: "From Caesar to Quantum — An Interactive Cryptography Journey",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Crypto Timeline",
  description:
    "An interactive museum-exhibit experience walking through the evolution of cryptography: from Caesar Cipher to Post-Quantum Cryptography.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "TechBi Company",
  },
  educationalLevel: "Beginner to Advanced",
  about: {
    "@type": "Thing",
    name: "Cryptography",
    description:
      "The history and evolution of cryptographic algorithms from classical ciphers to post-quantum cryptography.",
  },
};

export const viewport: Viewport = {
  themeColor: "#080b14",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? "";

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <WebVitalsReporter />
            <OfflineIndicator />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
