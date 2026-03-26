import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
  title: "Crypto Timeline — A History of Cryptography",
  description:
    "An interactive museum-exhibit experience walking through the evolution of cryptography: from Caesar Cipher to Post-Quantum Cryptography.",
  keywords: ["cryptography", "AES", "RSA", "ECC", "post-quantum", "DES", "Caesar cipher"],
  authors: [{ name: "TechBi Company" }],
  openGraph: {
    title: "Crypto Timeline",
    description: "From Caesar to Quantum — An Interactive Cryptography Journey",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
