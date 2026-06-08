import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/lib/site';
import { getLang } from '@/lib/getLang';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: `${site.name}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.tagline,
  keywords: [
    'biomedical research',
    'pharmacovigilance',
    'real-world evidence',
    'clinical prediction model',
    'multi-omics',
  ],
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang();
  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'} className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Navbar lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
