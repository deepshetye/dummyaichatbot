import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chat Application - Advanced Search & Nested Comments",
  description: "Professional AI chat interface with advanced search capabilities, nested comment system, and real-time interactions. Built with Next.js, TypeScript, and TanStack Query.",
  keywords: ["AI Chat", "Next.js", "TypeScript", "React Query", "Nested Comments", "Search", "SSR", "Progressive Enhancement"],
  authors: [{ name: "AI Chat Application" }],
  creator: "AI Chat Application",
  publisher: "AI Chat Application",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "AI Chat Application - Advanced Search & Nested Comments",
    description: "Professional AI chat interface with advanced search and nested comments",
    type: "website",
    locale: "en_US",
    siteName: "AI Chat Application",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Chat Application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat Application",
    description: "Professional AI chat interface with advanced search and nested comments",
    creator: "@aichatapp",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://aichatapp.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
