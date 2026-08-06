import type { Metadata } from 'next';
import HomeAltPage from '@/components/home-alt/HomeAltPage';

export const metadata: Metadata = {
  title: 'Evoluciona Pharma — Provider Portal (alternative home)',
};

export default function IndexAlt() {
  return <HomeAltPage />;
}
