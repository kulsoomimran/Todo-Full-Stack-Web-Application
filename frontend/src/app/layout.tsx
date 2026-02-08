import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TaskFlow - Organize Your Tasks Effortlessly',
  description: 'TaskFlow: A modern, elegant task management application with secure authentication. Organize, track, and complete your tasks with ease.',
  keywords: 'task management, todo app, productivity, organize tasks',
  authors: [{ name: 'TaskFlow Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'TaskFlow - Organize Your Tasks Effortlessly',
    description: 'A modern, elegant task management application with secure authentication.',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✓</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}