import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Sidebar } from '@/components/shared/sidebar';
import '@/styles/globals.css';

const inter = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Promptfy',
  description: 'Promptfy is a platform for sharing and discovering prompts',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='pt-BR' data-yd-content-ready='true'>
      <body
        className={`${inter.className} flex min-h-screen overflow-hidden antialiased`}
      >
        <Sidebar />
        <main className='flex-1'>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
