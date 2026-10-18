import type { Metadata } from 'next';
import './globals.css';
import './admin-overrides.css';
import './demo.css';

export const metadata: Metadata = {
  title: 'Tributo Educa Perú - Demo administrativa',
  description: 'Demostración visual del panel administrativo de Tributo Educa Perú',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
