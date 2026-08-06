import type { Metadata } from 'next';
import FaqPage from '@/components/faq/FaqPage';
import { faqTopics } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Provider FAQ — Evoluciona Pharma',
};

export default function Faq() {
  return <FaqPage topic={faqTopics[0]} />;
}
