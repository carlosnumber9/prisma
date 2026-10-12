import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { origin } from '../lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Prisma · Programas electorales', template: '%s · Prisma' },
  description:
    'Consulta resúmenes revisados de programas electorales por partido y área, con fuentes y estado de revisión.',
  ...(origin ? { metadataBase: new URL(origin) } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
