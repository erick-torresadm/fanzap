import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fanzap - Automação de WhatsApp',
  description: 'Plataforma SaaS para automação de WhatsApp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full antialiased">
        {children}
      </body>
    </html>
  );
}