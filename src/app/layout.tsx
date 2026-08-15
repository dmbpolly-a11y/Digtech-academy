import type { Metadata } from 'next';
import { Sora, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Digtech Academy — Skills that pay',
    template: '%s | Digtech Academy'
  },
  description: "Uganda's multi-tenant academy for live and self-paced courses. Learn from tutors you trust, track your progress, and earn verifiable certificates.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: { icon: '/images/digitechlogo.png', shortcut: '/images/digitechlogo.png', apple: '/images/digitechlogo.png' },
  openGraph: {
    title: 'Digtech Academy — Skills that pay',
    description: "Uganda's multi-tenant academy for live and self-paced courses.",
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
