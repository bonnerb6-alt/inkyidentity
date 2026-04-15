import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InkyIdentity — Your Permanent QR Tattoo',
  description: 'Generate a permanent QR code tattoo that links to your always-up-to-date digital profile. One scan. Your world.',
  keywords: 'QR code tattoo, digital identity, profile link, bio link, tattoo QR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
