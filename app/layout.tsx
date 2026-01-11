import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LazorKitProviderWrapper } from "@/components/LazorKitProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LazorKit Passkey Starter | Solana",
  description: "Next.js starter template for LazorKit Passkey Wallets on Solana",
};

// Polyfill for Buffer needed for Solana Web3.js
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100`}
      >
        <LazorKitProviderWrapper>
          {children}
        </LazorKitProviderWrapper>
      </body>
    </html>
  );
}
