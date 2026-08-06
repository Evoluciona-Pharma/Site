import type { Metadata } from 'next';
import { Anek_Latin, Fira_Code, Instrument_Sans, Instrument_Serif } from 'next/font/google';
import AppShell from '@/components/AppShell';
import './globals.css';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});
const sans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});
const logo = Anek_Latin({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-anek-latin',
  display: 'swap',
});
const mono = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Evoluciona Pharma — Provider Portal',
  description:
    'Compounded formulations for licensed healthcare providers. Products dispensed against patient-specific prescriptions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${logo.variable} ${mono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
