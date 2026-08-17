import type { Metadata } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', 
  display: 'swap' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['600', '700', '800'],
  variable: '--font-montserrat', 
  display: 'swap' 
});

export const metadata: Metadata = {
  title: {
    default: 'Digtech Academy — Skills that pay',
    template: '%s | Digtech Academy'
  },
  description: "Uganda's multi-tenant academy for live and self-paced courses. Learn from tutors you trust, track your progress, and earn verifiable certificates.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: { icon: '/images/Digtech Academy Logo Icon.png', shortcut: '/images/Digtech Academy Logo Icon.png', apple: '/images/Digtech Academy Logo Icon.png' },
  openGraph: {
    title: 'Digtech Academy — Skills that pay',
    description: "Uganda's multi-tenant academy for live and self-paced courses.",
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
