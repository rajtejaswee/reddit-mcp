import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit MCP | The Front Page, Refined",
  description: "A minimalist, privacy-focused Reddit search engine built with Model Context Protocol. Open source and ad-free.",
  keywords: ["Reddit", "MCP", "Search", "Developer Tools", "Minimalist"],
  authors: [{ name: "Raj Tejaswee", url: "https://www.linkedin.com/in/raj-tejaswee-147603247/" }],
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
        {children}
      </body>
    </html>
  );
}
