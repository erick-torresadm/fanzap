import type { Metadata } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  variable: '--font-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fanzap - Automação de WhatsApp',
  description: 'Plataforma SaaS para automação de WhatsApp com flow builder visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body className="min-h-full font-sans antialiased">
        <TooltipProvider>
          <Sidebar>{children}</Sidebar>
        </TooltipProvider>
      </body>
    </html>
  );
}