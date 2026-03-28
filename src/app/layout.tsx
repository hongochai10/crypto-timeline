import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import ErrorBoundary from "@/components/ErrorBoundary";
import WebVitalsReporter from "@/components/WebVitalsReporter";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <WebVitalsReporter />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
