import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { origin } from '../lib/site';
import './globals.css';

const mako = localFont({
  src: './fonts/Mako-Regular.ttf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-mako',
});

export const metadata: Metadata = {
  title: { default: 'Prisma · Programas electorales', template: '%s · Prisma' },
  description:
    'Consulta resúmenes revisados de programas electorales por partido y área, con fuentes y estado de revisión.',
  ...(origin ? { metadataBase: new URL(origin) } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={mako.variable}>
      <body>{children}</body>
    </html>
  );
}
